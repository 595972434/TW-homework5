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
  console.log(ItemArray);
  let s=CalcCost(ItemArray);
  console.log(s);
  return s;
}

/**
 * @return {string}
 */
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

  let cost1String = PromItem[0].type;
  let cost2String=PromItem[1].type+'(';

  for(let i in cost2Array)
  {
    cost2String+=cost2Array[i]+'，';
  }
  cost2String=cost2String.substr(0, cost2String.length - 1);
  cost2String+=')，省'+ cost2Discount.toString()+'元';

  if(cost1<30 &&cost2Discount==0)
  { return '';}
  else
  {
    if(cost1>=30)
    {
      if((cost1-6)<=cost2)
      { return cost1String;}
      else
      { return cost2String;}
    }
    else
    { return cost2String}
  }
}
