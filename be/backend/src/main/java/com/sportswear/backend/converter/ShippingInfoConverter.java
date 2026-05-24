package com.sportswear.backend.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportswear.backend.dto.order.ShippingInfo;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ShippingInfoConverter implements AttributeConverter<ShippingInfo, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ShippingInfo shippingInfo) {
        try {
            return objectMapper.writeValueAsString(shippingInfo);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi convert ShippingInfo to JSON", e);
        }
    }

    @Override
    public ShippingInfo convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, ShippingInfo.class);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi convert JSON to ShippingInfo", e);
        }
    }
}
