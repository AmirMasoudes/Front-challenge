class Persons {
    constructor() {
        this.data = this.loadData();
        this.currentEditIndex = null;
        this.currentDeleteIndex = null;
        this.currentLocationIndex = null;
        document.getElementById('saveButton').addEventListener('click', () => this.saveData());
        this.populateTable();

        const accordions = document.getElementsByClassName("accordion");
        for (let i = 0; i < accordions.length; i++) {
            accordions[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    }

    saveData() {
        const firstName = document.getElementById("addName").value;
        const lastName = document.getElementById("addLastName").value;
        const nationalCode = document.getElementById("addNationalId").value;
        const newData = {
            firstName: firstName,
            lastName: lastName,
            nationalCode: nationalCode,
            location: null
        };

        this.data.push(newData);
        this.updateLocalStorage();
        this.populateTable();
        $('#addModal').modal('hide');
    }

    loadData() {
        const jsonData = localStorage.getItem('formData');
        return jsonData ? JSON.parse(jsonData) : [];
    }

    updateLocalStorage() {
        localStorage.setItem('formData', JSON.stringify(this.data));
    }

    populateTable() {
        const tableBody = document.querySelector("#dataTable tbody");
        tableBody.innerHTML = ''; // Clear existing rows

        this.data.forEach((record, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.firstName}</td>
                <td>${record.lastName}</td>
                <td>${record.nationalCode}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="persons.viewRecord(${index})" data-toggle="modal" data-target="#viewModal">مشاهده</button>
                    <button class="btn btn-warning btn-sm" onclick="persons.editRecord(${index})" data-toggle="modal" data-target="#editModal">ویرایش</button>
                    <button class="btn btn-danger btn-sm" onclick="persons.deleteRecord(${index})" data-toggle="modal" data-target="#deleteModal">حذف</button>
                    <button class="btn btn-primary btn-sm" onclick="persons.showChart(${index})" data-toggle="modal" data-target="#chartModal">نمودار</button>
                    <button class="btn btn-secondary btn-sm" onclick="persons.showMap(${index})" data-toggle="modal" data-target="#mapModal">نقشه</button>
                    <button class="btn btn-success btn-sm" onclick="persons.setLocation(${index})" data-toggle="modal" data-target="#locationModal">ثبت موقعیت</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    openAddModal() {
        this.clearForm();
        $('#addModal').modal('show');
    }

    closeModal(modalId) {
        $(`#${modalId}`).modal('hide');
    }

    clearForm() {
        document.getElementById("addName").value = '';
        document.getElementById("addLastName").value = '';
        document.getElementById("addNationalId").value = '';
    }

    viewRecord(index) {
        const record = this.data[index];
        document.getElementById('viewName').innerText = `نام: ${record.firstName}`;
        document.getElementById('viewLastName').innerText = `نام خانوادگی: ${record.lastName}`;
        document.getElementById('viewNationalId').innerText = `کد ملی: ${record.nationalCode}`;
    }

    editRecord(index) {
        const record = this.data[index];
        this.currentEditIndex = index;
        document.getElementById("editName").value = record.firstName;
        document.getElementById("editLastName").value = record.lastName;
        document.getElementById("editNationalId").value = record.nationalCode;
    }

    updateRecord() {
        const index = this.currentEditIndex;
        this.data[index].firstName = document.getElementById("editName").value;
        this.data[index].lastName = document.getElementById("editLastName").value;
        this.data[index].nationalCode = document.getElementById("editNationalId").value;
        this.updateLocalStorage();
        this.populateTable();
        $('#editModal').modal('hide');
    }

    deleteRecord(index) {
        this.currentDeleteIndex = index;
    }

    confirmDelete() {
        this.data.splice(this.currentDeleteIndex, 1);
        this.updateLocalStorage();
        this.populateTable();
        $('#deleteModal').modal('hide');
    }

    showChart(index) {
        // Logic to display chart
    }

    exportChart(format) {
        // Logic to export chart in the specified format
    }

    showMap(index) {
        const record = this.data[index];
        if (record.location) {
            const location = record.location;
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: location
            });
            new google.maps.Marker({
                position: location,
                map: map
            });
        } else {
            alert('موقعیت مکانی برای این شخص ثبت نشده است.');
        }
    }

    setLocation(index) {
        this.currentLocationIndex = index;
        this.initLocationMap();
    }

    initLocationMap() {
        const map = new google.maps.Map(document.getElementById("locationMap"), {
            zoom: 15,
            center: { lat: 35.6892, lng: 51.3890 }
        });

        const marker = new google.maps.Marker({
            position: { lat: 35.6892, lng: 51.3890 },
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', () => {
            const position = marker.getPosition();
            this.data[this.currentLocationIndex].location = {
                lat: position.lat(),
                lng: position.lng()
            };
        });
    }

    saveLocation() {
        this.updateLocalStorage();
        this.populateTable();
        $('#locationModal').modal('hide');
    }

    search() {
        const searchName = document.getElementById('searchName').value.toLowerCase();
        const searchLastName = document.getElementById('searchLastName').value.toLowerCase();
        const searchNationalId = document.getElementById('searchNationalId').value.toLowerCase();

        const filteredData = this.data.filter(record => {
            return (record.firstName.toLowerCase().includes(searchName) &&
                    record.lastName.toLowerCase().includes(searchLastName) &&
                    record.nationalCode.toLowerCase().includes(searchNationalId));
        });

        this.populateTable(filteredData);
    }

    populateTable(data = this.data) {
        const tableBody = document.querySelector("#dataTable tbody");
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach((record, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.firstName}</td>
                <td>${record.lastName}</td>
                <td>${record.nationalCode}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="persons.viewRecord(${index})" data-toggle="modal" data-target="#viewModal">مشاهده</button>
                    <button class="btn btn-warning btn-sm" onclick="persons.editRecord(${index})" data-toggle="modal" data-target="#editModal">ویرایش</button>
                    <button class="btn btn-danger btn-sm" onclick="persons.deleteRecord(${index})" data-toggle="modal" data-target="#deleteModal">حذف</button>
                    <button class="btn btn-primary btn-sm" onclick="persons.showChart(${index})" data-toggle="modal" data-target="#chartModal">نمودار</button>
                    <button class="btn btn-secondary btn-sm" onclick="persons.showMap(${index})" data-toggle="modal" data-target="#mapModal">نقشه</button>
                    <button class="btn btn-success btn-sm" onclick="persons.setLocation(${index})" data-toggle="modal" data-target="#locationModal">ثبت موقعیت</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

const persons = new Persons();

function initMap() {
    persons.initLocationMap();
}
