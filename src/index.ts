import './assets/css/main.css';
// import './assets/css/style.css';
const table = document.querySelector<HTMLDivElement>('.table')!;
const cabinet = document.querySelector<HTMLDivElement>('.cabinet')!;
const closeBtn = document.querySelector<HTMLDivElement>('.close')!;
const loader = document.querySelector<HTMLDivElement>('.loader')!;
const userName = document.querySelector<HTMLDivElement>('.user-name')!;
const userUsername = document.querySelector<HTMLDivElement>('.user-username')!;
const modal = document.querySelector<HTMLDivElement>('.modal')!;



function alertFunction(text: string, color: true | false) {
   const alertElement = document.querySelector<HTMLDivElement>('.alert-element')!;
   alertElement.style.display = "flex";
   alertElement.textContent = text;
   alertElement.style.background = color ? "green" : "red";
   alertElement.style.color = color ? "#fff" : "#fff";
   setTimeout(() => {
      alertElement.style.display = "none";
   }, 2500);
}

function swithCabinet(status: boolean) {
   if (status) {
      table.style.overflow = 'hidden';
      cabinet.classList.add('show');
   }
   else {
      table.style.overflow = 'auto';
      cabinet.classList.remove('show');
   }
}
closeBtn.addEventListener('click', () => {
   swithCabinet(false)
   table.style.overflow = 'auto';
   const newUrl = location.href.split("?")[0];
   history.replaceState({}, '', newUrl);
});


const getDate = async () => {
   loader.style.display = 'flex';
   // const base = `https://jsonplaceholder.typicode.com/users`;
   const base = `http://localhost:1010/users`;
   const request = await fetch(base);
   const data = await request.json();
   loader.style.display = 'none';
   // return data;
   return data.data;
}


getDate().then((date) => {
   console.log("Data: ", date);
   UI(date);
}).catch((error) => {
   console.error(error.message);
});


function UI(data: any[]) {
   const main = document.querySelector<HTMLDivElement>('.main');
   const about = document.querySelector<HTMLDivElement>('.about');
   let users = [...data];
   console.log("Users: " + data);

   let rowNum = 0;

   const refreshTable = () => {
      const rows = main.querySelectorAll('.row');
      for (let i = 0; i < rows.length; i++) {
         const row = rows[i] as unknown as HTMLTableCellElement;
         row.children[0].textContent = `${i + 1}`;
      }
   };

   for (const user of data) {
      rowNum++;
      const row = document.createElement('div');
      row.classList.add('row', "item");
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      const div4 = document.createElement('div');
      const div5 = document.createElement('div');
      const deleteBtn = document.createElement('button');
      const watchBtn = document.createElement('button');
      watchBtn.innerHTML = '<i class="uil uil-eye"></i>';

      div1.textContent = `${rowNum}`;
      div1.className = "item1";
      div2.textContent = user.lastname + ' ' + user.firstname;
      div2.className = "item2";
      div3.textContent = user.username;
      div3.className = "item3";
      div4.textContent = user.more.email;
      div4.className = "item4";
      div5.className = "item5";
      deleteBtn.innerHTML = '<i class="uil uil-trash"></i>';
      deleteBtn.setAttribute('data-id', `${user.id}`);
      watchBtn.addEventListener('click', (e) => {
         const url = `?id=${user.id}`;
         location.href = url;
      });

      deleteBtn.addEventListener('click', (e) => {
         const id = +(e.target as HTMLElement).getAttribute('data-id');
         data.splice(id, 1);
         row.remove();
         refreshTable();
      });

      div5.append(watchBtn, deleteBtn);
      row.append(div1, div2, div3, div4, div5);
      main.appendChild(row);
   }
   let href = location.search;
   if (href !== "") {
      const params = new URLSearchParams(href);
      const id = +params.get("id");
      let user = users[id - 1];
      // let user = data[id - 1];

      if (user) {
         swithCabinet(true);
         about.innerHTML = `
         <div class="ceil"><span>Full name</span><span>${user.firstname}</span></div>
         <div class="ceil"><span>Last name</span><span>${user.lastname}</span></div>
         <div class="ceil"><span>Username</span><span>${user.username}</span></div>
         <div class="ceil"><span>Age</span><span>${user.age}</span></div>
         <div class="ceil"><span>Job</span><span>${user.job}</span></div>
         <div class="ceil"><span>Email</span><span>${user.more.email}</span></div>
         <div class="ceil"><span>Phone</span><span>${user.more.phone}</span></div>
         <div class="ceil"><span>State</span><span>${user.address.state}</span></div>
         <div class="ceil"><span>City</span><span>${user.address.city}</span></div>
         `;
         // <div class="ceil"><span>City</span><span>${user.address.city}</span></div>
         // <div class="ceil"><span>Street</span><span>${user.address.street}</span></div>
         // <div class="ceil"><span>Suite</span><span>${user.address.suite}</span></div>
         // <div class="ceil"><span>website</span><span>${user.website}</span></div>
         // <div class="ceil"><span>Company name</span><span>${user.company.name}</span></div>
      }
   }
}


// =======================================================================================================================
// =======================================================================================================================


const addForm = document.querySelector<HTMLFormElement>('.add-form');
const editForm = document.querySelector<HTMLFormElement>('.edit-form');
const panelAddMenu = document.querySelector('.add-btn');
const panelEditMenu = document.querySelector('.edit-btn');
const adminPanelBtn = document.querySelector('.admin-panel');
const panelOverlay = document.querySelector('.panel-overlay');
const addFormOverlay = document.querySelector('.add-form-overlay');
const editFormOverlay = document.querySelector('.edit-form-overlay');
const closePanelBtn = document.querySelector('.close-panel');
const closeAddFormBtn = document.querySelector('.close-add-form');
const closeEditFormBtn = document.querySelector('.close-edit-form');
const editFormFindSelect = document.querySelector<HTMLSelectElement>('#edit-form-find-id');


getDate().then((data) => {
   for (let i = 0; i < data.length; i++) {
      const user = data[i];
      const option = document.createElement('option');
      option.value = user.id;
      option.text = user.lastname + ' ' + user.firstname;
      editFormFindSelect.appendChild(option);
   }
});

editFormFindSelect.addEventListener('change', () => {
   let id = editFormFindSelect.value;
   console.log(typeof id);
   getDate().then((data) => {
      let user = data[parseInt(id) - 1];
      if (id !== "") {
         editForm.firstname.value = user.firstname;
         editForm.lastname.value = user.lastname;
         editForm.username.value = user.username;
         editForm.age.value = user.age;
         editForm.job.value = user.job;
         editForm.email.value = user.more.email;
         editForm.number.value = user.more.phone;
         editForm.country.value = user.address.state;
         editForm.city.value = user.address.city;
      }
      else {
         for (let key in editForm) {
            editForm[key].value = "";
         }
      }
   })
})

addForm.addEventListener('submit', (e) => {
   e.preventDefault();
   const firsName = addForm.firstname.value.trim();
   const lastName = addForm.lastname.value.trim();
   const username = addForm.username.value.trim();
   const number = addForm.number.value.trim();
   const country = addForm.country.value.trim();
   const city = addForm.city.value.trim();
   const website = addForm.website.value.trim();

   if (!firsName || !lastName || !username || !number || !country || !city || !website) {
      alertFunction("Barcha ma'lumotlarni to'ldiring", false);
   }
   else {
      alertFunction("Success user added", true);
      console.log("First Name: ", firsName);
      console.log("Last Name: ", lastName);
      console.log("Username: ", username);
      console.log("Number: ", number);
      console.log("Country: ", country);
      console.log("City: ", city);
      console.log("Website: ", website);
   }
})


editForm.addEventListener("submit", (e) => {
   e.preventDefault();

});


adminPanelBtn.addEventListener("click", () => {
   panelOverlay.classList.add('show');
});


panelAddMenu.addEventListener('click', () => {
   addFormOverlay.classList.add('show');
});
panelEditMenu.addEventListener('click', () => {
   editFormOverlay.classList.add('show');
});

closePanelBtn.addEventListener('click', () => {
   panelOverlay.classList.remove('show');
});
closeAddFormBtn.addEventListener('click', () => {
   addFormOverlay.classList.remove('show');
});
closeEditFormBtn.addEventListener('click', () => {
   editFormOverlay.classList.remove('show');
});

document.addEventListener("keydown", function (event) {
   if (event.code === "Escape") {
      panelOverlay.classList.remove('show');
      addFormOverlay.classList.remove('show');
      editFormOverlay.classList.remove('show');
   }
});