document.addEventListener('DOMContentLoaded', () => {
    // document.getElementById('printReceipt').addEventListener('click', printReceipt);
    // document.getElementById('generateReport').addEventListener('click', generateReport);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    }
  });
  
  async function printReceipt() {
    console.log('Printing receipt...');
    // Implement print functionality here
  }
  
  async function generateReport() {
    const date = new Date().toISOString().split('T')[0];
    const response = await fetch(`/api-new/sales/report?date=${date}`);
    const report = await response.json();
    document.getElementById('report').innerHTML = JSON.stringify(report, null, 2);
    console.log('Report generated:', report);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch today's sales data
    const fetchTodaysSales = async () => {
      try {
        const response = await fetch('/api-new/sales-today-produk');
        const sales = await response.json();
        console.log(sales);
        displaySales(sales);
      } catch (error) {
        console.error('Error fetching today\'s sales:', error);
      }
    };
  
    // Function to display sales data in the dashboard
    const displaySales = (sales) => {
      const salesList = document.getElementById('sales-list');
      salesList.innerHTML = ''; // Clear existing list

      let totalSalesAmount = 0;
  
      sales.data.forEach(sale => {
        totalSalesAmount += parseFloat(sale.total_amount);

        
        // const saleItem = document.createElement('div');
        
        // saleItem.innerHTML = `
        // <div>${sale.item_name}</div>
        // <div>${sale.total_amount}</div>
        // `;
        
        // salesList.appendChild(saleItem);
        
        const saleItem = document.createElement('li');
        saleItem.textContent = `${sale.item_name} ::: ${sale.total_amount}`;
        salesList.appendChild(saleItem);
      });
      // Add total sales amount at the end of the list
      const totalElement = document.createElement('div');
      totalElement.className = 'sales-recap-total';
      totalElement.innerHTML = `
        <div>Total Sales:</div>
        <div>${totalSalesAmount}</div>
      `;
      salesList.appendChild(totalElement);
    };
  
    let selectedItems = [];
  
    // Function to fetch sales items
    const fetchSalesItems = async () => {
      try {
        const response = await fetch('/api-new/items/all_available');
        const salesItems = await response.json();
        console.log(salesItems) 
        displaySalesItems(salesItems);
      } catch (error) {
        console.error('Error fetching sales items:', error);
      }
    };
  
    // Function to display produk items
    const displaySalesItems = (items) => {
      const salesItemsList = document.getElementById('sales-items-list');
      salesItemsList.innerHTML = '';
  
      items.data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'sales-item';
  
        itemElement.innerHTML = `
          <div>${item.name}</div>
          <div>${item.price}</div>
          <button data-id="${item.id}" class="add-to-cart">Add to Cart</button>
        `;
  
        salesItemsList.appendChild(itemElement);
      });
  
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
      });
    };
  
    // Function to add item to cart
    const addToCart = (event) => {
      const itemId = event.target.getAttribute('data-id');
      const itemName = event.target.parentElement.querySelector('div:first-child').innerText;
      const itemPrice = parseFloat(event.target.parentElement.querySelector('div:nth-child(2)').innerText);

      const existingItem = selectedItems.find(item => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = parseFloat((existingItem.quantity * itemPrice).toFixed(0));
      } else {
        selectedItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1, totalPrice: itemPrice });
      }

      displayCart();
    };

      // Function to remove item from cart
      const removeFromCart = (event) => {
        const itemId = event.target.getAttribute('data-id');

        const existingItem = selectedItems.find(item => item.id === itemId);
        if (existingItem) {
          existingItem.quantity -= 1;
          existingItem.totalPrice = parseFloat((existingItem.quantity * existingItem.price).toFixed(0));

          if (existingItem.quantity === 0) {
            selectedItems = selectedItems.filter(item => item.id !== itemId);
          }

          displayCart();
        }
      };
  
    // Function to display cart items
    const displayCart = () => {
      const cartList = document.getElementById('cart-list');
      cartList.innerHTML = '';
  
      selectedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
  
        itemElement.innerHTML = `
        <div>${item.name}</div>
        <div>${item.price.toFixed(0)}</div>
        <div>${item.quantity}</div>
        <div>${item.totalPrice.toFixed(0)}</div>
        <button data-id="${item.id}" class="remove-from-cart">-</button>
      `;
  
        cartList.appendChild(itemElement);
      });

      document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
      });

      // Calculate and display total amount
      const totalAmount = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(0);
      const totalElement = document.createElement('div');
      totalElement.className = 'cart-total';
      totalElement.innerHTML = `
        <div>Total: ${totalAmount}</div>
      `;
      cartList.appendChild(totalElement)

    };

    
  
    // Function to handle checkout
    const handleCheckout = async () => {
      const totalAmount = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      try {
        // Step 1: Post total sales
        const totalResponse = await fetch('/api-new/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: new Date().toISOString().split('T')[0], amount: totalAmount })
        });

        if (!totalResponse.ok) {
          throw new Error('Error creating total sales');
        }
  
        const salesData = await totalResponse.json();
        const salesId = salesData.data.rows[0].id;
        

        // Step 2: Post detailed sales items
        const detailedSalesItems = selectedItems.map(item => ({
          sale_id: salesId,
          item_id: item.id,
          quantity: item.quantity
        }));
        const salesItemsResponse = await fetch('/api-new/sales-items-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(detailedSalesItems)
        });

        if (!salesItemsResponse.ok) {
          throw new Error('Error creating sales items');
        }

        alert('Checkout successful!');
        selectedItems = [];
        displayCart();

        //refresh today sales
        fetchTodaysSales();

      } catch (error) {
        console.error('Error during checkout:', error);
      }
    };
  
    // Attach checkout event
    document.getElementById('checkout-button').addEventListener('click', handleCheckout);
  
    // Fetch and display sales items on load
    fetchSalesItems();
    // Fetch and display today's sales when the page loads
    fetchTodaysSales();
  });
  
  