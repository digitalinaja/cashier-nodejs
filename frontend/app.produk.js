document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-produk-baru').addEventListener('click', addProduk);
    // let selectedItems = [];
  
    const tambahButton = document.getElementById('tambah-button');
    tambahButton.addEventListener('click', function() {
        document.getElementById('produk-form').style.display = 'block';
    });

    async function addProduk() {
        const namaProduk = document.getElementById('nama-produk').value;
        const hargaProduk = document.getElementById('harga-produk').value;
    
        const url = '/api-new/add-produk'; //
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: namaProduk,
                    price: hargaProduk
                }),
            });
    
            if (!response.ok) {
                throw new Error('Gagal menambahkan produk');
            }
    
            alert('Produk berhasil ditambahkan!');
            fetchSalesItems();
            // Tambahan: mungkin Anda ingin melakukan sesuatu setelah berhasil menambahkan produk
    
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
        if (variable === "1") {
            return 0;
        } else if (variable === "0") {
            return 1;
        } else {
            // Menangani kasus jika nilai variabel tidak valid (opsional)
            console.log(variable)
            throw new Error('Nilai variabel harus 0 atau 1');
        }
    }
  
    // Function to display sales items
    const displaySalesItems = (items) => {
      const salesItemsList = document.getElementById('sales-items-list');
      salesItemsList.innerHTML = '';
  
      items.data.forEach(item => {
        const itemElement = document.createElement('div');
        let availstatus = "Ok";
        let classred = "";
        if (item.available=="0") {
            availstatus = "!" 
            classred = "not-available"
        }
        let availChange = toggleValue(item.available);
        itemElement.className = 'sales-item';
  
        itemElement.innerHTML = `
          <div>${item.name}</div>
          <div>${item.price}</div>
          <button data-id="${item.id}" data-avail="${availChange}" class="update-availability ${classred}">${availstatus}</button>
        `;
  
        salesItemsList.appendChild(itemElement);
      });

      document.querySelectorAll('.update-availability').forEach(button => {
        button.addEventListener('click', updateAvailability);
      });
  
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