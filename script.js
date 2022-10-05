'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0

  const movs = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov} €</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // 2. DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  // 3. DISPLAY BALANCE
  calcDisplayBalance(acc);

  // 4. DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // 1. DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    // 1+. CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount / 10;
    })
  ) {
    // ADD MOVEMENT
    currentAccount.movements.push(amount);

    // UPDATE UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// FINDINDEX METHOD BELOW HERE

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    // DELETE ACCOUNT
    accounts.splice(index, 1);
    // HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//const user = 'Steven Thomas Williams'; // stw
//console.log(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/*

// MAP RETURNS A NEW ARRAY[2,3,4,5] = CURRENT * 2 => [4,6,8,10]
// FILTER RETRUNS A NEW ARRAY[2,3,4,5],THAT PASSED THE TEST CONDITION FOR EXAMPLE: current > 2 = > [3,4,5]
// REDUCE RETURNS ALL ELEMENTS IN AN ARRAY[2,3,4,5] TO A SINGLE VALUE = REDUCE => 14 


let arr = ['a', 'b', 'c', 'd', 'e'];


// SLICE METHIOD // DO NOT MUTATE ORIGINAL

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
//-------------------------------------------------------------------//

// SPLICE METHOD // EXTRACT ELEMENT // MUTATE ORIGINAL

//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(`Arr1: ${arr}`);
//-------------------------------------------------------------------//

// REVERSE METHOD

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(`Arr2: ${arr2}`);
//-------------------------------------------------------------------//

// CONCAT METHOD

const letters = arr.concat(arr2);
console.log(letters);
//-------------------------------------------------------------------//

// JOIN METHOD

console.log(letters.join(' - '));
//-------------------------------------------------------------------//

// MAP METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

//const movementsUSD = movements.map(function (mov) {
//return mov * eurToUsd;
//});

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(function (mov, i) {
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : `withdrew`} ${Math.abs(mov)}`;
});
console.log(movementsDescriptions);

//-------------------------------------------------------------------//

// FILTER METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);

//-------------------------------------------------------------------//

// REDUCE METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator = > SNOWBALL
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

// Maximum value

const max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//-------------------------------------------------------------------//

// CHAINING METHODS

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

// PIPELINE
const totalDepositsInUSD = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * eurToUsd;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  });

console.log(totalDepositsInUSD);

//-------------------------------------------------------------------//

// FIND METHOD => ONLY RETURNS ELEMENT NOT ARRAY !!

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(function (mov) {
  return mov < 0;
});
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

// ACCOUNT OBJECT IS TOP OF THE CODE
const account = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});
console.log(account);

const forAcc = [];
for (const acc of accounts) {
  if (acc === account2) forAcc.push(acc);
}
console.log(forAcc);

const forAcc = [];
for (var acc of accounts) {
  if (acc === accounts[1]) forAcc.push(acc);
}
console.log(forAcc);

//-------------------------------------------------------------------//

// SOME METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// CONDITION
console.log(
  movements.some(function (mov) {
    return mov === -130;
  })
);

const anyDeposits = movements.some(function (mov) {
  return mov > 1500;
});
console.log(anyDeposits);

// EVERY METHOD

console.log(
  movements.every(function (mov) {
    return mov > 0;
  })
);

console.log(
  account4.movements.every(function (mov) {
    return mov > 0;
  })
);

// SEPARATE CALLBACK
const deposit = function (mov) {
  return mov > 0;
};
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//-------------------------------------------------------------------//

// FLAT METHOD

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// FLAT
const overallBalance = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
console.log(overallBalance);

// FLATMAP

const overallBalance2 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
console.log(overallBalance2);

//-------------------------------------------------------------------//

// SORT METHOD => MUTATE ORIGINAL ARRAY

const owners = ['Jonas', 'Zac', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// NUMBERS
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
console.log(movements.sort());

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

//ASCENDING
movements.sort(function (a, b) {
  return a - b;
});
console.log(movements);

//DESCENDING
//movements.sort(function (a, b) {
// a current value , b next value
//if (a > b) return -1;
//if (b > a) return 1;
//});
movements.sort(function (a, b) {
  return b - a;
});
console.log(movements);

//-------------------------------------------------------------------//

// FILL METHOD

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// EMPTY ARRAYS + FILL METHOD
const x = new Array(7);
console.log(x);
//x.map(function () {
//return 5;
//});

//x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// ARRAY.from
const y = Array.from({ length: 7 }, function () {
  return 1;
});
console.log(y);

const z = Array.from({ length: 7 }, function (_, i) {
  return i + 1;
});
console.log(z);

const diceRolls = Array.from({ length: 100 }, function (_, i) {
  return Math.trunc(Math.random(i) * 100) + 1;
});
console.log(diceRolls);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(
    movementsUI.map(function (el) {
      return Number(el.textContent.replace('€', ''));
    })
  );

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});

//-------------------------------------------------------------------//

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('------ FOREACH ------');
movements.forEach(function (mov, i, array) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

// CANT BREAK OUT FOREACH LOOP ALWAYS LOOP THE ENTIRE ARRAY

// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...



// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// SET
// SET DOESN'T HAVE KEYS AND INDEXES !!!
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

*/

// PRACTICE

// 1.

const bankDepositSum = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .filter(function (mov) {
    return mov > 0;
  })
  .reduce(function (sum, cur) {
    return sum + cur;
  }, 0);
console.log(bankDepositSum);

// 2.

/*const numDeposits1000 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .filter(function (mov) {
    return mov >= 1000;
  }).length; */

const numDeposits1000 = accounts
  .flatMap(function (acc) {
    return acc.movements;
  })
  .reduce(function (count, cur) {
    return cur >= 1000 ? ++count : count;
  }, 0);

console.log(numDeposits1000);

// PREFIXED ++ OPERATOR

let a = 10;
console.log(++a);
console.log(a);

// 3.
