# Flatsome Compatible - UX Builder for Jankx Theme

Flatsome-style drag-and-drop UX Builder tích hợp vào Jankx Theme, giúp người dùng thiết kế layout trực quan.

## Yêu cầu

- WordPress 5.8+
- Jankx Theme 2.0+
- PHP 7.4+
- Node.js 18+ (để build frontend)

## Cài đặt

Extension được tự động phát hiện bởi Jankx Theme Extension Manager.

### Build frontend

```bash
cd wp-content/themes/jankx/extensions/flatsome-compatible
npm install
npm run build:wp
```

## REST API

- `GET /wp-json/jankx/ux-builder/v1/layout` - Lấy layout hiện tại
- `POST /wp-json/jankx/ux-builder/v1/layout` - Lưu layout
- `GET /wp-json/jankx/ux-builder/v1/element-types` - Danh sách element types
