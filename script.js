function lifeInWeeks(age) {
    var yearsRemaining = 90 - age;
    var year = 365 * yearsRemaining;
    var weeksInAYear = 52 * yearsRemaining;
    var monthsInAYear = 12 * yearsRemaining;
    console.log("You have "+year+" days, "+weeksInAYear+" weeks, and "+monthsInAYear+" months left.")
}
    
function bmiCalculator(weight, height) {
    var bmi = weight / (height*height);
    return Math.round(bmi);
}
function bmiCalculatorAdvance(weight, height) {
    var bemi = weight / (height * height);
    console.log(bemi)
    if(bemi < 18.5) {
        console.log("Your BMI is "+bemi+", so you are underweight.");
    } else if (bemi > 24.9) {
        console.log("Your BMI is "+bemi+", so you are overweight.");
    } else if (bemi >= 18.5 || bemi <= 24.9) {
        console.log("Your BMI is "+bemi+", so you have a normal weight.");
    }
}

function loveCalculator(name, loveName) {
    var loveScore = Math.random() * 100;
    loveScore = Math.floor(loveScore) + 1;
    if(loveScore>75){
        console.log("Your love is loving score with "+loveScore+"%")
    } else if(loveScore<50) {
        console.log("Your love score is dogshit with "+loveScore+"%")
    } else {
        console.log("Your love score is "+loveScore+"%")
    }
}
function isLeapYear(year){
    if(year%4==0 && year%100!=0)
        return true;
    if(year%400==0)
        return true;
    return false;
}
function fizzBuzz(){
    var count = 1;
    var output = [];
    while (count <= 100){
        if(count % 3==0 && count % 5==0){
            output.push("FizzBuzz")
        }
        if(count % 3==0){
            output.push("Fizz");
        } else
        if(count % 5==0){
            output.push("Buzz");
        } else {
            output.push(count);
        }
        count++;
        console.log(output)
    }
}
function whosPaying(names){
    var whosInNumber = Math.random()*names.length; 
    var nameOfPayer = names[Math.round(whosInNumber)];
    return nameOfPayer+" is going to buy lunch today!";
}
function legendaryFibonacci(numberOfIteration){
    var output = [];
    for (let i = 0; i < numberOfIteration; i++) {
        if(i>1)
            output.push(output[i-1] + output[i-2]);
        if(i==0||i==1)
            output.push(i)
    }
    return output;
}
lifeInWeeks(56)
console.log(bmiCalculator(55, 1.7));
loveCalculator("Cawlo", "Cawla");
bmiCalculatorAdvance(58, 1.7);

console.log(isLeapYear(2000));
console.log(isLeapYear(2100));
console.log(isLeapYear(2400));
console.log(isLeapYear(1989));

console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));

// fizzBuzz()

console.log("FIBONACCI: "+legendaryFibonacci(30));
// legendaryFibonacci(10);