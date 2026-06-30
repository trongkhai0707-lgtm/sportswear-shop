package com.sportswear.backend.service;

import com.sportswear.backend.dto.cart.CartItemDto;
import com.sportswear.backend.dto.cart.CartItemRequest;
import com.sportswear.backend.dto.cart.CartResponse;
import com.sportswear.backend.exception.ResourceNotFoundException;
import com.sportswear.backend.entity.Cart;
import com.sportswear.backend.entity.CartItem;
import com.sportswear.backend.entity.Product;
import com.sportswear.backend.entity.ProductVariant;
import com.sportswear.backend.entity.User;
import com.sportswear.backend.repository.CartRepository;
import com.sportswear.backend.repository.ProductRepository;
import com.sportswear.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserService userService;

    @Transactional
    public CartResponse addToCart(CartItemRequest request) {
        User currentUser = userService.getCurrentUser();
        log.info("Adding to cart - user: {}, productId: {}, variantId: {}, qty: {}",
                currentUser.getUsername(), request.getProductId(), request.getVariantId(), request.getQuantity());

        Cart cart = getOrCreateCart(currentUser);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        if (!variant.getProduct().getId().equals(product.getId())) {
            log.warn("Variant id: {} does not belong to product id: {}", variant.getId(), product.getId());
            throw new IllegalArgumentException("Variant does not belong to this product");
        }

        if (variant.getStock() < request.getQuantity()) {
            log.warn("Insufficient stock - variantId: {}, requested: {}, available: {}",
                    variant.getId(), request.getQuantity(), variant.getStock());
            throw new IllegalArgumentException("Not enough stock");
        }

        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (variant.getStock() < newQuantity) {
                log.warn("Insufficient stock after update - variantId: {}, requested total: {}, available: {}",
                        variant.getId(), newQuantity, variant.getStock());
                throw new IllegalArgumentException("Not enough stock");
            }
            existingItem.setQuantity(newQuantity);
            log.debug("Updated existing cart item - variantId: {}, newQty: {}", variant.getId(), newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setVariant(variant);
            newItem.setQuantity(request.getQuantity());
            newItem.setPriceAtTime(variant.getPrice());
            cart.getCartItems().add(newItem);
            log.debug("Added new cart item - productId: {}, variantId: {}", product.getId(), variant.getId());
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse getCart() {
        User currentUser = userService.getCurrentUser();
        log.debug("Fetching cart for user: {}", currentUser.getUsername());
        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createNewCart(currentUser));
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long itemId, int quantity) {
        User currentUser = userService.getCurrentUser();
        log.info("Updating cart item - itemId: {}, newQty: {}, user: {}", itemId, quantity, currentUser.getUsername());

        Cart cart = getCartByUser(currentUser);

        CartItem item = cart.getCartItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            log.debug("Removing cart item id: {} (qty <= 0)", itemId);
            cart.getCartItems().remove(item);
        } else {
            if (item.getVariant().getStock() < quantity) {
                log.warn("Insufficient stock on update - itemId: {}, requested: {}, available: {}",
                        itemId, quantity, item.getVariant().getStock());
                throw new IllegalArgumentException("Not enough stock");
            }
            item.setQuantity(quantity);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeFromCart(Long itemId) {
        User currentUser = userService.getCurrentUser();
        log.info("Removing cart item - itemId: {}, user: {}", itemId, currentUser.getUsername());

        Cart cart = getCartByUser(currentUser);
        cart.getCartItems().removeIf(item -> item.getId().equals(itemId));
        return mapToResponse(cartRepository.save(cart));
    }

    // ==================== Helper methods ====================

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createNewCart(user));
    }

    private Cart createNewCart(User user) {
        log.debug("Creating new cart for user: {}", user.getUsername());
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private Cart getCartByUser(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    private CartResponse mapToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());

        List<CartItemDto> itemDtos = cart.getCartItems().stream().map(item -> {
            CartItemDto dto = new CartItemDto();
            dto.setItemId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setColor(item.getVariant().getColor());
            dto.setSizeName(item.getVariant().getSize().getName());
            dto.setImageUrl(item.getProduct().getImageUrl());
            dto.setPrice(item.getPriceAtTime());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(
                    item.getPriceAtTime()
                            .multiply(BigDecimal.valueOf(item.getQuantity()))
            );
            return dto;
        }).collect(Collectors.toList());

        response.setItems(itemDtos);
        response.setTotalItems(itemDtos.size());

        BigDecimal totalAmount = itemDtos.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalAmount(totalAmount);

        return response;
    }
}