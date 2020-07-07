$(document).ready(function() {
    var container = $(".container");
    var currentDay = $("#currentDay");
    var currentTime = $("#currentTime");
    var todoForm = $("#todo-form");

    currentDay.text(moment().format('dddd, MMMM Do YYYY'));
    currentTime.text(moment().format('h:mm a'));

    var hourArray = ["8:00 am","9:00 am","10:00 am","11:00 am","12:00 pm","1:00 pm","2:00 pm","3:00 pm","4:00 pm","5:00 pm","6:00 pm","7:00 pm"]; 
    var hourArray2 = [8,9,10,11,12,13,14,15,16,17,18,19]; 
    
    var todos = ["","","","","test","","","","","",""];

    var hourBlock;
    var hour; 
    var description;
    var textarea;
    var saveBtn;
    var trashBtn;

    function renderTodos() {        
        for (var i = 0; i < hourArray.length; i++) {
            hourBlock = $("<div>")
                .attr("class","plannerRow")
                .appendTo(container);   //todoForm --- trying to see if using a form will allow textarea to save

            hour = $("<div>")
                .text(hourArray[i])
                .attr("class","hour col-2")
                .appendTo(hourBlock);

            description = $("<div>")
                .text("")
                .attr("class","description col-6")
                .attr("id","description-" + i)
                .appendTo(hourBlock);

            textarea = $("<textarea>")   
                .text(todos[i])
                .attr("class","textarea col-12")
                .attr("type","text")
                .attr("id","textarea-" + i)
                .appendTo(description);
            /*    textarea.on("change",myFunction({
                    
                }));     */

            saveBtn = $("<button>")
                .text("Save")  
                .attr("class","saveBtn col-2")
                .appendTo(hourBlock);   

            saveImage = $("<img>")
                .attr("src","./save.png")
                .css({height:"50px",width:"60px", paddingLeft:"15px"})
                .appendTo(saveBtn);   
            
            $(".saveBtn").on("click", function() {
                todos.splice(i, 1, $("#textarea-"+i));
                console.log($("#textarea-"+i),i);
            });    

            trashBtn = $("<button>")
            .text("Delete")  
            .attr("class","trashBtn col-2")
            .appendTo(hourBlock); 
            
            trashImage = $("<img>")
                .attr("src","./trash.png")
                .css({height:"50px",width:"60px", paddingLeft:"15px"})
                .appendTo(trashBtn);  

            $(".trashBtn").on("click", function() {
                todos.splice(i, 1);
            });        

            /*    bellImage = $("<img>")
                .attr("src","./bell.png")
                .css({height:"50px",width:"50px", paddingLeft:"15px"})
                .appendTo(hour[i]);   */               //NOT WORKING AS INTENDED -- On clicking 'saveBtn' puts bells all in last row 
            
            // trashBtn = $("<button>")
            // .text("Delete")  
            // .attr("class","trashBtn col-2")
            // .appendTo(hourBlock);      
        };        
    }

    function checkTime () {
        for (var j = 0; j < hourArray2.length; j++) {
           
            var currentHour = Number(moment().startOf('day').fromNow().slice(0,2).trim());
                 
                if (currentHour < hourArray2[j]) { 
                     $(`#description-${j}`).css({
                        backgroundColor: "#77dd77",
                        color: "white"
                          });
                 } else if (currentHour == hourArray2[j]) {
                     $(`#description-${j}`).css({ 
                        backgroundColor: "#ff6961",
                        color: "white"
                     });
                 } else if (currentHour > hourArray2[j]) {
                    $(`#description-${j}`).css({
                        backgroundColor: "#d3d3d3",
                        color: "white"
                });
            }   
        }
    }

    function storeTodos() {
        // Stringify and set "todos" key in localStorage to todos array
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function init() {
        // Get stored todos from localStorage
        // Parsing the JSON string to an object
        var storedTodos = JSON.parse(localStorage.getItem("todos"));
    
        // If todos were retrieved from localStorage, update the todos array to it
        if (storedTodos !== null) {
        todos = storedTodos;
        }
    
        // Render todos to the DOM
        renderTodos();
    }

    init();
    checkTime();
    storeTodos();
});