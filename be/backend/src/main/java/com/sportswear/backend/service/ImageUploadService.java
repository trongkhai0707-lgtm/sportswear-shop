package com.sportswear.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {
    private final Cloudinary cloudinary;

    private static final String FOLDER = "sportswear-shop/products";

    /**
     * Upload nhiều ảnh lên Cloudinary, trả về danh sách URL.
     * Nếu 1 ảnh lỗi, các ảnh khác vẫn tiếp tục upload (không fail toàn bộ request).
     */
    public List<String> uploadImages(List<MultipartFile> files) {
        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String url = uploadSingleImage(file);
                uploadedUrls.add(url);
            } catch (IOException e) {
                log.error("Upload ảnh thất bại: {}", file.getOriginalFilename(), e);
                // Bỏ qua file lỗi, tiếp tục upload các file còn lại
            }
        }

        return uploadedUrls;
    }

    private String uploadSingleImage(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "resource_type", "image"
                )
        );
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Xoá ảnh khỏi Cloudinary dựa trên public_id (dùng cho việc sửa/xoá sản phẩm sau này).
     */
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Xoá ảnh thất bại: {}", publicId, e);
        }
    }
}
