package com.sportswear.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.sportswear.backend.dto.cart.CartItemRequest;
import com.sportswear.backend.dto.cart.CartResponse;
import com.sportswear.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Cart", description = "Quản lý giỏ hàng — yêu cầu đăng nhập")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Thêm sản phẩm vào giỏ",
            description = "Nếu variant đã có trong giỏ thì cộng dồn số lượng.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Giỏ hàng sau khi thêm"),
            @ApiResponse(responseCode = "400", description = "Không đủ tồn kho hoặc variant không thuộc product"),
            @ApiResponse(responseCode = "404", description = "Product hoặc Variant không tồn tại")
    })
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        log.info("Adding product {} to cart, quantity: {}", request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @Operation(summary = "Xem giỏ hàng hiện tại")
    @ApiResponse(responseCode = "200", description = "Giỏ hàng của user")
    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        log.info("Fetching user cart");
        return ResponseEntity.ok(cartService.getCart());
    }

    @Operation(summary = "Cập nhật số lượng item trong giỏ",
            description = "Truyền quantity = 0 để xóa item khỏi giỏ.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Giỏ hàng sau khi cập nhật"),
            @ApiResponse(responseCode = "400", description = "Không đủ tồn kho"),
            @ApiResponse(responseCode = "404", description = "Item không tồn tại trong giỏ")
    })
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(
            @Parameter(description = "ID của cart item")
            @PathVariable Long itemId,
            @Parameter(description = "Số lượng mới (0 = xóa)")
            @RequestParam int quantity) {
        log.info("Updating cart item {} to quantity {}", itemId, quantity);
        return ResponseEntity.ok(cartService.updateCartItem(itemId, quantity));
    }

    @Operation(summary = "Xóa một item khỏi giỏ hàng")
    @ApiResponse(responseCode = "200", description = "Giỏ hàng sau khi xóa")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
            @Parameter(description = "ID của cart item")
            @PathVariable Long itemId) {
        log.info("Removing cart item {}", itemId);
        return ResponseEntity.ok(cartService.removeFromCart(itemId));
    }
}