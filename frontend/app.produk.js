document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-produk-baru').addEventListener('click', addProduk);
    // let selectedItems = [];
  
    const tambahButton = document.getElementById('tambah-button');
    tambahButton.addEventListener('click', function() {
        document.getElementById('produk-form').style.display = 'block';
    });

    async function addProduk() {
        const produkId = document.getElementById('produk-id').value;
        const namaProduk = document.getElementById('nama-produk').value;
        const hargaProduk = document.getElementById('harga-produk').value;
        const url = produkId ? '/api-new/update-produk' : '/api-new/add-produk';

        const requestBody = produkId ? 
            { id: produkId, name: namaProduk, price: hargaProduk } : 
            { name: namaProduk, price: hargaProduk };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                throw new Error(produkId ? 'Gagal mengupdate produk' : 'Gagal menambahkan produk');
            }
    
            alert(produkId ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
            document.getElementById('produk-form').style.display = 'none';
            fetchSalesItems();
    
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menambahkan produk');
        }
    }

    // Function to fetch items
    const fetchSalesItems = async () => {
      try {
        const response = await fetch('/api-new/items/all');
        const salesItems = await response.json();
        console.log(salesItems) 
        displaySalesItems(salesItems);
      } catch (error) {
        console.error('Error fetching sales items:', error);
      }
    };

    const toggleValue = (variable) => {
        return variable === "1" ? "0" : "1";
    };
  
    // Function to display sales items
    const displaySalesItems = (items) => {
      const salesItemsList = document.getElementById('sales-items-list');
      salesItemsList.innerHTML = '';
  
      items.data.forEach(item => {
        const itemElement = document.createElement('div');
        let availstatus = item.available === "0" ? "!" : "Ok";
        let classred = item.available === "0" ? "not-available" : "";
        let availChange = toggleValue(item.available);

        itemElement.className = 'sales-item';
        itemElement.dataset.id = item.id;
        itemElement.dataset.name = item.name;
        itemElement.dataset.price = item.price;
        itemElement.dataset.available = item.available;
  
        itemElement.innerHTML = `
          <div>${item.name}</div>
          <div>${item.price}</div>
          <button data-id="${item.id}" data-avail="${availChange}" class="update-availability ${classred}">${availstatus}</button>
        `;
  
        salesItemsList.appendChild(itemElement);
      });

      document.querySelectorAll('.sales-item').forEach(item => {
        item.addEventListener('click', populateForm);
      });
      document.querySelectorAll('.update-availability').forEach(button => {
        button.addEventListener('click', updateAvailability);
      });
  
    };

    const populateForm = (event) => {
        const produkId = event.currentTarget.dataset.id;
        const namaProduk = event.currentTarget.dataset.name;
        const hargaProduk = event.currentTarget.dataset.price;

        document.getElementById('produk-id').value = produkId;
        document.getElementById('nama-produk').value = namaProduk;
        document.getElementById('harga-produk').value = hargaProduk;
        document.getElementById('produk-form').style.display = 'block';
    };

    // Function to fetch items
    const updateAvailability = async (event) => {
        const produkId = event.target.getAttribute('data-id');
        const availChange = parseInt(event.target.getAttribute('data-avail'));
        try {
            const response = await fetch('/api-new/update-produk',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: produkId,
                    available: availChange
                }),
            });
            
            //reload item
            fetchSalesItems();

        } catch (error) {
            console.error('Error fetching sales items:', error);
        }
        };

    // Fetch and display sales items on load
    fetchSalesItems();

});