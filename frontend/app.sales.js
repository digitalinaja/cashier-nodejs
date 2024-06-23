document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch today's sales data
    const fetchTodaysSales = async () => {
      try {
        const response = await fetch('/api-new/sales');
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
  
      sales.data.forEach(sale => {
        const saleItem = document.createElement('li');
        saleItem.textContent = `Sale ID: ${sale.id}, Amount: ${sale.amount}`;
        salesList.appendChild(saleItem);
      });
    };
  
    // Fetch and display today's sales when the page loads
    fetchTodaysSales();
  });