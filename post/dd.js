// let input = ['10 500', '93 181 245 214 315 36 185 138 216 295'];
let input = ['5 21', '5 6 7 8 9'];
let [N, M] = input
  .shift()
  .split(' ')
  .map(el => Number(el));
let numbers = input
  .shift()
  .split(' ')
  .map(el => Number(el))
  .sort((a, b) => a - b);
console.log(N, M);
console.log(numbers);
let result = numbers[0] + numbers[1] + numbers[2];

for (let i = 3; i < N; i++) {
  let sum = numbers[i] + numbers[i - 1] + numbers[i - 2];
  console.log(sum);
  if (sum <= M) {
    if (result < sum) {
      result = sum;
    }
  }
}
console.log(result);
