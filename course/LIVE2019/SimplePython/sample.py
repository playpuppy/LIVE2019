def FizzBuzz(n):
  if (n % 15 == 0):
    print("FizzBuzz")
  elif (n % 5 == 0):
    print("Buzz")
  elif (n % 3 == 0):
    print("Fizz")
  else:
    print(n)

N = 30
for i in range(1, N+1):
  FizzBuzz(i)