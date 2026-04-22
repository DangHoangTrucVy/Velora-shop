async function fetchProducts() {
  const productList = document.getElementById('product-list');

  productList.innerHTML = '<p>Đang tải sản phẩm...</p>';

  try {
    const response = await fetch(`${BASE_URL}/products`);
    const products = await response.json();

    if (!response.ok) {
      throw new Error(products.message || 'Không lấy được sản phẩm');
    }

    if (!products.length) {
      productList.innerHTML = '<p>Chưa có sản phẩm nào.</p>';
      return;
    }

    productList.innerHTML = products.map(product => `
      <div class="product-card">
        <a href="./product-detail.html?id=${product.id}" class="product-link">
          <img
            src="${product.image ? product.image : 'https://via.placeholder.com/300x350?text=No+Image'}"
            alt="${product.name}"
          />
          <h3>${product.name}</h3>
        </a>
        <p class="price">${Number(product.price).toLocaleString('vi-VN')} VND</p>
        <p class="category">${product.category_name || 'Chưa có danh mục'}</p>
        <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    productList.innerHTML = `<p>Có lỗi khi tải sản phẩm: ${error.message}</p>`;
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
    console.error('Lỗi thêm giỏ hàng:', error);
    alert(error.message);
  }
}

fetchProducts();