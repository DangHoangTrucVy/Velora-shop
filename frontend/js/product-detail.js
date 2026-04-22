function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchProductDetail() {
  const productId = getProductIdFromUrl();
  const detailContainer = document.getElementById('product-detail');

  if (!productId) {
    detailContainer.innerHTML = '<p>Không tìm thấy id sản phẩm.</p>';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    const product = await response.json();

    if (!response.ok) {
      throw new Error(product.message || 'Không lấy được chi tiết sản phẩm');
    }

    detailContainer.innerHTML = `
      <div class="detail-card">
        <div class="detail-image">
          <img
            src="${product.image ? product.image : 'https://via.placeholder.com/400x500?text=No+Image'}"
            alt="${product.name}"
          />
        </div>

        <div class="detail-info">
          <h1>${product.name}</h1>
          <p class="detail-category">Danh mục: ${product.category_name || 'Chưa có danh mục'}</p>
          <p class="detail-price">${Number(product.price).toLocaleString('vi-VN')} VND</p>
          ${
            product.old_price
              ? `<p class="detail-old-price">${Number(product.old_price).toLocaleString('vi-VN')} VND</p>`
              : ''
          }
          <p class="detail-stock">Tồn kho: ${product.stock}</p>
          <p class="detail-desc">${product.description || 'Chưa có mô tả'}</p>

          <div class="detail-actions">
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            <a href="./index.html" class="back-link">Quay lại</a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Lỗi chi tiết sản phẩm:', error);
    detailContainer.innerHTML = `<p>Có lỗi khi tải chi tiết sản phẩm: ${error.message}</p>`;
  }
}

async function addToCart(productId) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Bạn cần đăng nhập trước');
    window.location.href = './login.html';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thêm được vào giỏ');
    }

    alert(data.message || 'Đã thêm vào giỏ hàng');
  } catch (error) {
    console.error('Lỗi thêm vào giỏ:', error);
    alert(error.message);
  }
}

fetchProductDetail();