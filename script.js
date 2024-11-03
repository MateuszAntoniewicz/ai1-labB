class Todo{
    static tasks = [];

    static loadTasks() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }

    static addToStorage() {
        const textValue = document.getElementById("sendBoxText").value;
        let dateValue = document.getElementById("sendBoxDate").value;
        let idValue;

        if (textValue.length < 3 || textValue.length > 255){
            alert("Pole tekstowe musi zawierać od 3 do 255 znaków");
            return;
        }


        if (dateValue != ""){
            dateValue = new Date(dateValue);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            dateValue.setHours(0, 0, 0, 1);

            if (dateValue <= currentDate){
                alert("Data musi być pusta lub w przyszłości");
                return;
            }
        }

        if (dateValue != "") {
            dateValue.setDate(dateValue.getDate() + 1);
            dateValue = dateValue.toISOString().split('T')[0];
        }

        if (this.tasks.length === 0){
            idValue = 0;
        }
        else {
            idValue = this.tasks[this.tasks.length - 1].id + 1;
        }


        const taskObject = {
            text: textValue,
            date: dateValue,
            id: idValue
        };

        this.tasks.push(taskObject);
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        document.getElementById("sendBoxText").value = "";
        document.getElementById("sendBoxDate").value = "";

        this.lista();
    }

    static lista(){
        const tasksDiv = document.querySelectorAll(".task");

        tasksDiv.forEach(task => task.remove());

        const mainBlock = document.querySelector(".mainBlock");
        const sendBox = document.querySelector(".sendBox");

        this.tasks.forEach(task => {
            const newDiv = document.createElement("div");
            newDiv.className = "task";

            const spanText = document.createElement("span");
            spanText.className = "textTask";
            spanText.innerText = task.text;
            spanText.addEventListener('click', () => this.editTask(task.id, spanText));

            newDiv.appendChild(spanText);

            const spanDate = document.createElement("span");
            spanDate.className = "dateTask";
            spanDate.innerText = task.date;
            spanDate.addEventListener('click', () => this.editDate(task.id, spanDate));

            if (spanDate.innerText === ""){
                spanDate.innerText = "=";
                spanDate.style.color = "transparent";
            }

            if (spanDate.innerText === "="){
                spanDate.innerText = "=";
                spanDate.style.color = "transparent";
            }



            newDiv.appendChild(spanDate);

            const deleteButton = document.createElement("button");
            deleteButton.className = "buttonTask";
            deleteButton.type = "submit";
            deleteButton.innerText = "Usuń";
            const index = task.id;
            deleteButton.onclick = () => this.deleteRecord(index);
            newDiv.appendChild(deleteButton);

            mainBlock.insertBefore(newDiv, sendBox);


        });
    }

    static deleteRecord(deleteRecord){
        const updatedItems = this.tasks.filter(item => item.id !== deleteRecord);
        localStorage.setItem('tasks', JSON.stringify(updatedItems));
        this.loadTasks();
        this.lista();
    }

    static search(){
        const textValue = document.getElementById("searchBox").value;
        const term = textValue.toLowerCase();
        const taskDiv = document.querySelectorAll(".task");

        if (textValue.length < 2){
            taskDiv.forEach(taskDiv => {
                taskDiv.classList.remove("hidden");
                const textSpan = taskDiv.querySelector(".textTask");
                if (textSpan){
                    textSpan.innerHTML = textSpan.dataset.original || textSpan.innerText;
                }
            });
            return;
        }

        taskDiv.forEach(taskDiv => {
            const text = taskDiv.querySelector(".textTask");
            if (text) {
                const originalText = text.innerText;
                const highlightedText = originalText.replace(new RegExp(`(${term})`, 'gi'), '<span class="highlight">$1</span>');
                text.dataset.original = originalText;
                text.innerHTML = highlightedText;
                if (originalText.toLowerCase().includes(term)) {
                    taskDiv.classList.remove("hidden");
                } else {
                    taskDiv.classList.add("hidden");
                }
            }
        });
    }

    static editTask(id, spanText){
        const inputText = document.createElement("input");
        inputText.type = "text";
        inputText.className = "editTask";
        inputText.id = "editTask";


        const taskDiv = spanText.parentNode;
        taskDiv.replaceChild(inputText, spanText);

        inputText.focus();

        inputText.addEventListener("blur", function(){
            let textSend = document.getElementById("editTask").value;
            if (textSend.length === 0){
                textSend = spanText.innerText;
            }

            Todo.tasks = Todo.tasks.map(task => {
                if (task.id === id){
                    return { ...task, text: textSend };
                }
                return task;
            })

            localStorage.setItem("tasks", JSON.stringify(Todo.tasks));
            taskDiv.replaceChild(spanText, inputText);

            Todo.lista();
        });
    }

    static editDate(id, spanDate){
        const inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.className = "editDate";
        inputDate.id = "editDate";

        const taskDiv = spanDate.parentNode;
        taskDiv.replaceChild(inputDate, spanDate);
        inputDate.focus();

        inputDate.addEventListener("blur", function(){
            let dateSend = document.getElementById("editDate").value;
            if (dateSend === ""){
                dateSend = spanDate.innerText;
            }

            Todo.tasks = Todo.tasks.map(task => {
                if (task.id === id){
                    return { ...task, date: dateSend };
                }
                return task;
            })

            localStorage.setItem("tasks", JSON.stringify(Todo.tasks));
            taskDiv.replaceChild(spanDate, inputDate);

/*            if (spanDate.innerText === "="){
                spanDate.style.color = "transparent";
            }*/
            Todo.lista();
        });


    }

}

window.onload = function (){
    Todo.loadTasks();
    Todo.lista();
}

