// BUDGET CONTROLLER
var DataC =(function(){

//INCOME FUNCTION CONSTRUCTOR
var Income =function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value;}

//EXPENSE FUNCTION CONSTRUCOR
var Expense = function(id,description,value){
  this.id=id;
  this.description=description;
  this.value=value;
  this.percentage=0;

}



// CREATE A PROTOTYPE METHOD FOR PERCENTAGE
  Expense.prototype.percent=function()
{ if(data.total.inc!==0){
  this.percentage=Math.round((this.value/data.total.inc)*100);}
  else if(data.total.inc===0){
    this.percentage=""
  }
  return this.percentage;
};

//DATA STRUCTURE

var data={

  allitem:
  {
     exp:[],
     inc:[] },

  total:
  {
    exp:0,
    inc:0 },
  budget:0,
  percentage:0

};

// INCOME AND EXPENSE CALCULATION
var calculatetotal=function(type){
  var sum=0;
  data.allitem[type].forEach(function(curr){
    sum=sum+curr.value;
  });
  data.total[type]=sum;
}

  return {
    // ADD NEW ITEM TO DATA STRUCTURE
    additem:function(type,des,val){
      var newitem,id;

      //CREATE NEW ID //
      if(data.allitem[type].length > 0){
      id=data.allitem[type][data.allitem[type].length-1].id + 1;
      }
      else{
        id=0;
          }

      //CREATE NEW EXPENSE OBJECT
      if(type==='exp'){
        newitem=new Expense(id,des,val);

      }
      //CREATE NEW INCOME OBJECT
      else if (type==='inc'){
        newitem =new Income(id,des,val );
      }


      //ADD NEW ITEM TO THE DATA ARRAY
      data.allitem[type].push(newitem);
      return newitem;


    },
    // DELETE ITEM FROM DATA STRUCTURE
    deleteitem:function(type,id){
      var index=-1,arr=data.allitem[type];
      for(var i=0;i<arr.length;i++){
        if(arr[i].id===id){
          index=i;
        }
      }
      if(index!==-1){
      arr.splice(index,1);}

    },

    // CALCULATE THE TOTAL BUDGET AND PERCENTAGE
    calculatebudget:function(){
      var budget=0, percent=-1;

      //1. CALCULATE THE TOTAL INCOME AND EXPENSES
      calculatetotal('inc');
      calculatetotal('exp');

      //2 CALCULATE THE TOTAL BUDGET
      data.budget =data.total.inc-data.total.exp;

      //3. CALCULATE THE TOTAL EXPENSE PERCENTAGE
      if(data.total.inc!==0){
      data.percentage=  Math.round((data.total.exp/data.total.inc)*100);}
      else if(data.total.inc===0){
        data.percentage=""

      }

    },

    //UPDATE THE EXPENSES PERCENTAGE
    updatepercentage:function(){

      var exp=[], arr=data.allitem['exp'];
      for(var i=0; i<arr.length; i++){
         exp.push(arr[i].percent());

      }
      return exp;


    },


    //RETURN BUDGET OBJECT
    getbudget:function(){
      return {
        income:data.total.inc,
        expenses:data.total.exp,
        budget:data.budget,
        percentage:data.percentage
      }


    },

    testing:function(){
      console.log(data);
    }


  };
})();



// UI CONTROLLER
var UiC =(function(){

     var DOMstrings={
       valuetype:'.add__type',
       value:'.add__value',
       description:'.add__description',
       button:'.add__btn',
       container:'.container',
       incomeelement:".income__list",
       expenseelement:".expenses__list",
       income:".budget__income--value",
       budget:".budget__value",
       expenses:".budget__expenses--value",
       percentage:".budget__expenses--percentage",
       exppercentage:".item__percentage",
       month:".budget__title--month"

     };
     var formatno=function(num,type){
       var newnum ,dec,int;
       num=Math.abs(num);
       num=num.toFixed(2);

       newnum=num.split('.');
       dec=newnum[1];
       int=newnum[0];
       if(int.length > 3) {
         int= int.substr(0, int.length -3) +','+ int.substr(int.length-3,3);

       }
       return (type ==='exp' ? '-' : '+') +" "+ int +"."+ dec ;



     }


  return {
    //TAKE INPUT FROM UI
     getvalue:function(){
       return{
     valuetype:document.querySelector(DOMstrings.valuetype).value,
     value: parseFloat(document.querySelector(DOMstrings.value).value),
     description:document.querySelector(DOMstrings.description).value}


   },
    //RETURN DOMSTRING OBJECT
    getstrings:function(){
      return DOMstrings
    },


    //UPDATE THE INCOME AND EXPENSES LIST
     addui:function(obj,type){
       var html, newhtml,element;
    // 1. CREATE THE HTML STRING WITH PLACEHOLDER AND SELECT THE TYPE
    if(type==='inc'){
       element=DOMstrings.incomeelement;
        html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}

    else if(type==='exp'){
    element=DOMstrings.expenseelement;
    html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}


    //2. UPDATE THE HTML STRING AND REPLACE THE PLACEHOLDER
    newhtml=html.replace('%description%',obj.description);
    newhtml=newhtml.replace('%value%',formatno(obj.value,type));
    newhtml=newhtml.replace('%id%',obj.id);

    //3. INSERT THE HTML INTO THE DOM
    document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
  },
    //DELETE ITEM FROM UI
    removeui:function(item){

      item.parentNode.removeChild(item);




  },
  updatepercentage:function(per){
    var percentlist
    percentlist=document.querySelectorAll(DOMstrings.exppercentage);
    for(var i=0; i<per.length;i++){
      percentlist[i].textContent=per[i]+'%';
    }
  },



  clearField:function(){
    var fields,arrfields;
    fields=document.querySelectorAll(DOMstrings.value + ',' + DOMstrings.description);
    arrfields=Array.prototype.slice.call(fields);

    arrfields.forEach(function(current,index,array){
      current.value="";
    });

    arrfields[0].focus();

  },

  //UPDATE THE BUDGET UI
  displaybudget:function(budget){

    budget.budget>0 ? type='inc':type='exp'
    document.querySelector(DOMstrings.budget).textContent=formatno(budget.budget,type);
    document.querySelector(DOMstrings.income).textContent=formatno(budget.income,'inc');
    document.querySelector(DOMstrings.expenses).textContent=formatno(budget.expenses,'exp');
    document.querySelector(DOMstrings.percentage).textContent=budget.percentage +" %";

  },
  //UPDATE THE CURRENT DATE
  displayday:function(){
    var now,month, year;
    now=new Date();
    month=now.getMonth();
    year=now.getFullYear();
    months=['January','Febuary','March','April','May','June','July','August','September','October','November','December' ];
    document.querySelector(DOMstrings.month).textContent=months[month]+" "+year;

  },
  changetype:function(){
    var fields;
    fields=document.querySelectorAll(DOMstrings.valuetype+','+DOMstrings.value+','+DOMstrings.description );
    for(var i=0;i<fields.length;i++){
      fields[i].classList.toggle('red-focus');

    }
    document.querySelector(DOMstrings.button).classList.toggle('red');



  }




  };


})();





// MAIN APP CONTROLLER
var Controller =(function(data, ui){

  var setupeventlistner =function(){
      var DOM =ui.getstrings();
      document.querySelector(DOM.button).addEventListener('click',additem);
      //document.querySelector('.budget__income--text').addEventListener('click',additem);

      document.addEventListener('keypress',function(event){
        if(event.keycode===13|| event.which ===13){
          additem();}

         });

      document.querySelector(DOM.container).addEventListener('click',deleteitem);
      document.querySelector(DOM.valuetype).addEventListener('change',ui.changetype);



                //console.log(e.target.className);
                //deleteitem(e);
              //});

  }

  var percentageupdate=function(){
    var per;

    //1.CALCULATE AND GET THE NEW PERCENTAGE
    per=data.updatepercentage();

    //2.UPDATE THE PERCENTAGE UI
    ui.updatepercentage(per);


  }


  var updatebudget=function(){
    var budget;
    //1. CALCULATE THE NEW BUDGET
    data.calculatebudget();

    //2 GET THE NEW BUDGET
    budget=data.getbudget();

    //3 UPDATE THE UI
    ui.displaybudget(budget);


  }




   var additem=function(){
      //1. GET INPUT DATA FROM UI
     var input=ui.getvalue();
     console.log(input);

     if(input.value && input.description){

      //2. ADD NEW ITEM TO THE DATA STRUCTURE
      var newitem=data.additem(input.valuetype,input.description,input.value);
      data.testing();


      //3. ADD NEW ITEM TO THE UI
      ui.addui(newitem,input.valuetype);

      //4. CLEAR THE INPUT FIELDS

      ui.clearField();
      //5. CALCULATE THE BUDGET AND OTHER VALUE AND UPDATE UI

      updatebudget();


      //6. UPDATE EXPENSES PERCENTAGE
      percentageupdate();
    }



   }
   var deleteitem=function(e){
    var target,item, type, id;
    //1. GET INPUT FROM EVENT LISTNER
     if(e.target.className==='ion-ios-close-outline'){
      item=e.target.parentNode.parentNode.parentNode.parentNode;
      target=(e.target.parentNode.parentNode.parentNode.parentNode.id).split('-');
      if(target[0]==='income'){
        type='inc';}
      else if(target[0]==='expense'){
        type='exp';
      }
      id=parseInt(target[1]);

     //2. DELETE ITEM FROM DATA STRUCTURE
       data.deleteitem(type,id);

     //3. DELETE ITEM FORM UI
       ui.removeui(item);



     //4. UPDATE THE BUDGET AND UI
       updatebudget();

    //5. UPDATE EXPENSES PERCENTAGE
       percentageupdate();



   }
   }



return {
  init:function(){
   setupeventlistner();}



}



})(DataC,UiC);

Controller.init();
UiC.displayday();
UiC.displaybudget(
  {
    income:0,
    expenses:0,
    budget:0,
    percentage:0
  });
