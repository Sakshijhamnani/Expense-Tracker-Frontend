const axiosInstance = axios.create({
    baseURL : 'http://localhost:3000/api'
});

function validate(){
    const amount = document.getElementById('amount').value;
    const description =document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if(!amount){
        alert('Enter Your Amount');
        return false;
    }
    if(!description){
        alert('Enter Your description');
        return false;
    }
    if(category == 'Choose Category'){
        alert('Choose Your Category');
        return false;
    }
    return true;
}

async function handleFormSubmit(event) {
    if(validate()){
        event.preventDefault();
        const amount = event.target.amount.value;
        const description = event.target.description.value;
        const category = event.target.category.value;

        const obj = {
            amount,
            description,
            category
        }

        try {
            const res= await axiosInstance.post('/expenses',obj);
            console.log(res.data);
            showNewExpense(obj)
        } catch (error) {
            console.log(error)
        }
    }
}

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const res = await axiosInstance.get('/expenses');

        for(let i=0;i<res.data.length;i++){
            showNewExpense(res.data[i]);
        }
        
    } catch (error) {
        console.log(error);
        alert(error.message)
    }
})

function showNewExpense(obj){
    const tbody = document.querySelector('tbody');

    tbody.innerHTML += `<tr>
    <td>${obj.amount}</td>
    <td>${obj.description}</td>
    <td>${obj.category}</td>
    <td>
    <button type="button" class="btn btn-info" onclick="editExpense(${obj.id},this)">Edit</button>
    <button type="button" class="btn btn-danger" onclick="deleteExpense(${obj.id},this)">Delete</button>
    </td>`;

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = 'Choose Category'; 
}

async function editExpense(id,event) {
    const category = event.parentElement.previousElementSibling.textContent;
    const description = event.parentElement.previousElementSibling.previousElementSibling.textContent;
    const amount = event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

    console.log(amount,description,category);

    //populate these values in the input fields
    document.getElementById('amount').value = amount;
    document.getElementById('description').value = description;
    document.getElementById('category').value = category;

    document.getElementById('add').style.display = 'none';
    document.getElementById('update').style.display = 'inline-block';

    const editBtn = document.getElementById('update');

    editBtn.addEventListener('click',async()=>{
        if(validate()){
           const inputAmount = document.getElementById('amount').value;
           const inputDescription = document.getElementById('description').value;
           const inputCategory = document.getElementById('category').value;

           const obj = {
            amount : inputAmount,
            description : inputDescription,
            category : inputCategory
           }

           try {

            //update in the dom through event object
            event.parentElement.previousElementSibling.textContent = inputCategory;
            event.parentElement.previousElementSibling.previousElementSibling.textContent = inputDescription;
            event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent = inputAmount;

            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            document.getElementById('category').value = '';

            //update in database
            const update = await axiosInstance.put(`/expenses/${id}`,obj);

            document.getElementById('add').style.display = 'inline-block';
            document.getElementById('update').style.display = 'none';

            
           } catch (error) {
              console.log(err);
              alert(err.message);
           }
        }
    })
    
}

async function deleteExpense(id,event){
  try {
    const tbody = document.querySelector('tbody');
    const tr = event.parentElement.parentElement;
    tbody.removeChild(tr);
    const del = await axiosInstance.delete(`/expenses/${id}`);
  } catch (error) {
    console.log(err);
    alert(err.message);
  }
}