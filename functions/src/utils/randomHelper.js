const randomNumber = (numberLength, maximunNumber) => {
  let numberList = [];
  if (numberLength > maximunNumber) {
    for (let i = 0; i < maximunNumber; i++) {
      while (numberList.length === i) {
        let sameData = false;
        const numberRes = Math.floor(Math.random() * numberLength);
        for (let y = 0; y < numberList.length; y++) {
          if (numberRes === numberList[y]) {
            sameData = true;
          }
        }
        if (sameData === false) {
          numberList.push(numberRes);
        }
      }
    }
  } else {
    for (let i = 0; i < numberLength; i++) {
      numberList.push(i);
    }
  }
  // console.log(numberList);
  return numberList;
};

module.exports = { randomNumber };
