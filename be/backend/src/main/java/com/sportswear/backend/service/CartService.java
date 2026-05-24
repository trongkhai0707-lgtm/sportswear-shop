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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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
        Cart cart = getOrCreateCart(currentUser);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        // Đảm bảo variant thuộc product được chọn
        if (!variant.getProduct().getId().equals(product.getId())) {
            throw new IllegalArgumentException("Variant does not belong to this product");
        }

        if (variant.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock");
        }

        // Tìm item đã tồn tại theo variantId
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            // Kiểm tra lại stock sau khi cộng thêm
            if (variant.getStock() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock");
            }
            existingItem.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setVariant(variant);
            newItem.setQuantity(request.getQuantity());
            newItem.setPriceAtTime(variant.getPrice()); // lưu giá tại thời điểm thêm vào giỏ
            cart.getCartItems().add(newItem);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional(readOnly = true)
    public CartResponse getCart() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> createNewCart(currentUser));
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long itemId, int quantity) {
        User currentUser = userService.getCurrentUser();
        Cart cart = getCartByUser(currentUser);

        CartItem item = cart.getCartItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
        } else {
            // Kiểm tra stock trước khi update
            if (item.getVariant().getStock() < quantity) {
                throw new IllegalArgumentException("Not enough stock");
            }
            item.setQuantity(quantity);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeFromCart(Long itemId) {
        User currentUser = userService.getCurrentUser();
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