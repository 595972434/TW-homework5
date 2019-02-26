var loadAllItems = require('./items');
var loadPromotions = require('./promotions');
module.exports = function bestCharge(selectedItems) {

  let ItemArray=[];
  let allItem=loadAllItems();

  for(let index in selectedItems)
  {
    let itemName=selectedItems[index].split(' ')[0];
    let itemNum=selectedItems[index].split(' ')[2];

    for(let i in allItem)
    {
     if (allItem[i].id==itemName)
      {
        let addItem = {};
        addItem.id=allItem[i].id;
        addItem.name=allItem[i].name;
        addItem.num=itemNum;
        addItem.price=allItem[i].price;
        ItemArray.push(addItem);
        break;
      }
    }
  }
  let costResult=CalcCost(ItemArray);
  console.log(costResult);
  let printStr=PrintResult(ItemArray,costResult);
  console.log(printStr);
  return printStr;
}

function CalcCost(ItemJson){
  let PromItem=loadPromotions();
  //满30减6折扣计算
  let cost1=0;
  for(let i in ItemJson)
  {
    cost1+=ItemJson[i].price*ItemJson[i].num;
  }
  //指定菜品半价折扣计算
  let cost2=0;
  let cost2Discount=0;
  let cost2Array=[];
  for(let j in ItemJson)
  {
    if(PromItem[1].items.indexOf(ItemJson[j].id)>=0)
    {
      cost2Array.push(ItemJson[j].name);
      cost2+=(ItemJson[j].price/2*ItemJson[j].num);
      cost2Discount+=(ItemJson[j].price/2*ItemJson[j].num);
    }
    else
    { cost2+=ItemJson[j].price*ItemJson[j].num;}
  }

  let cost1String = PromItem[0].type+'，省6元';
  let cost2String=PromItem[1].type+'(';

  for(let i in cost2Array)
  {
    cost2String+=cost2Array[i]+'，';
  }
  cost2String=cost2String.substr(0, cost2String.length - 1);
  cost2String+=')，省'+ cost2Discount.toString()+'元';

  let costReturn={};
  costReturn.string='';
  costReturn.cost=0;
  if(cost1<30 &&cost2Discount==0)
  { costReturn.cost=cost1;}
  else
  {
    if(cost1>=30)
    {
      if((cost1-6)<=cost2)
      { costReturn.string=cost1String;costReturn.cost=cost1-6;}
      else
      { costReturn.string=cost2String;costReturn.cost=cost2;}
    }
    else
    { costReturn.string=cost2String;costReturn.cost=cost2;}
  }
  return costReturn;
}

function PrintResult(ItemJson,costJson){
  let ResultCtring='';
  ResultCtring+='============= 订餐明细 =============\n';
  for(let i in ItemJson)
  {
    let Str=ItemJson[i].name+' x '+ItemJson[i].num+' = '+ItemJson[i].num*ItemJson[i].price+'元\n';
    ResultCtring+=Str;
  }
  ResultCtring+='-----------------------------------\n';
  if(costJson.string!='')
  {
    ResultCtring+='使用优惠:\n';
    ResultCtring+=costJson.string+'\n';
    ResultCtring+='-----------------------------------\n';
  }
  ResultCtring+='总计：'+costJson.cost+'元'+'\n';
  ResultCtring+='===================================';
  return ResultCtring;
}
