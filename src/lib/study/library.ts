import type { PackKit } from "@/lib/study/types";

export type Pack = {
  id: string;
  track: "Python" | "AWS" | "HTML";
  title: string;
  blurb: string;
  level: "Starter" | "Core" | "Exam";
  keywords: string[];
  kit: PackKit;
};

const packs: Pack[] = [
  {
    id: "python-basics",
    track: "Python",
    title: "Python basics",
    blurb: "What Python is, setup, variables, operators, and the shape of a first program.",
    level: "Starter",
    keywords: ["python", "variable", "print", "syntax", "beginner", "setup"],
    kit: {
      title: "Python basics",
      summary:
        "Python is a high-level language valued for readable syntax. You store data in variables, Python picks the type for you, and you steer the program with operators, conditions, loops, and functions.\n\nA first program is often just `print(\"Hello, Python!\")`. From there, lists, dicts, files, and modules are the tools you reuse on almost every real task.",
      reviewer: [
        {
          heading: "Start here",
          points: [
            "Install from python.org and check with `python --version` or `python3 --version`.",
            "Use a real editor (VS Code is a solid default) and run files from a terminal.",
            "Python is dynamically typed: `age = 21` makes an int; `age = \"21\"` makes a string.",
          ],
        },
        {
          heading: "Variables and types",
          points: [
            "`str` text, `int` whole numbers, `float` decimals, `bool` True or False.",
            "`list` ordered and changeable, `tuple` ordered and fixed, `dict` key to value, `set` unique items.",
            "Names start with a letter or underscore, may include digits, and are case-sensitive. `name` and `Name` differ.",
          ],
        },
        {
          heading: "Operators",
          points: [
            "Arithmetic: `+ - * /` (true division) `//` floor ` % ` remainder `**` power.",
            "Comparison returns True or False: `== != > >= < <=`.",
            "Logic: `and`, `or`, `not`. Assignment: `=` and shortcuts like `+=`.",
          ],
        },
        {
          heading: "Control flow in one glance",
          points: [
            "`if` / `elif` / `else` choose a branch. Indentation defines the block. Four spaces is the usual style.",
            "`for item in collection` walks items. `while condition` repeats until the condition fails.",
            "Functions package work: `def greet(name): return f\"Hello, {name}\"`.",
          ],
        },
      ],
      flashcards: [
        { front: "What does dynamically typed mean in Python?", back: "You do not declare a type. The value you assign decides it, and a name can later hold a different type.", topic: "Types" },
        { front: "Which division operators does Python have?", back: "`/` is true division (5/2 is 2.5). `//` is floor division (5//2 is 2). `%` is the remainder.", topic: "Operators" },
        { front: "How do you write a boolean in Python?", back: "`True` and `False`, capital T and F. They are not strings.", topic: "Types" },
        { front: "What characters may start a variable name?", back: "A letter or underscore. Digits are allowed after that. Hyphens are not allowed.", topic: "Names" },
        { front: "What does indentation do?", back: "It groups statements into a block. A condition or loop body must be indented consistently.", topic: "Syntax" },
        { front: "List vs tuple vs dict vs set?", back: "List: ordered, mutable. Tuple: ordered, immutable. Dict: labeled key-value pairs. Set: unique unordered items.", topic: "Data" },
      ],
      quiz: [
        { question: "What is the result of `5 / 2` in Python 3?", answer: "2.5", explanation: "Single slash is true division and returns a float." },
        { question: "Is `2name = \"Ada\"` a valid assignment?", answer: "No. Names cannot start with a digit.", explanation: "Use `name2` or `name_2`." },
        { question: "What does `==` test that `=` does not?", answer: "`==` compares two values. `=` assigns.", explanation: "Using `=` inside a condition is a common slip." },
        { question: "Which type is best for a contact labeled by field names?", answer: "A dictionary.", explanation: "Keys such as name and email beat remembering positions." },
      ],
    },
  },
  {
    id: "python-lists",
    track: "Python",
    title: "Lists",
    blurb: "Ordered, mutable collections: create, index, slice, and the methods you actually use.",
    level: "Core",
    keywords: ["list", "append", "slice", "comprehension", "index", "mutable"],
    kit: {
      title: "Python lists",
      summary:
        "A list is an ordered, mutable collection written with square brackets. It can mix types, items are indexed from 0, and slicing copies a range without changing the original list.\n\nReach for a list when the order matters and the collection will grow or shrink: scores, to-dos, rows read from a file.",
      reviewer: [
        {
          heading: "Create and index",
          points: [
            "`fruits = [\"apple\", \"banana\", \"cherry\"]`, `empty = []`, mixed values are allowed.",
            "`fruits[0]` is the first item. `fruits[-1]` is the last.",
            "Assigning `fruits[1] = \"mango\"` replaces an item because lists are mutable.",
          ],
        },
        {
          heading: "Slicing",
          points: [
            "`nums[start:end]` includes start and stops before end.",
            "`nums[:3]` is the first three. `nums[2:]` is from index 2 to the end. `nums[::-1]` reverses.",
            "A slice is a new list. Changing the slice does not change the original.",
          ],
        },
        {
          heading: "Add and remove",
          points: [
            "`append(x)` adds one item at the end. `extend(other)` adds many. `insert(i, x)` adds at an index.",
            "`pop()` removes and returns the last item. `pop(i)` removes by index. `remove(x)` removes by value.",
            "`del fruits[0]` deletes by index. `clear()` empties the list.",
          ],
        },
        {
          heading: "Useful tools",
          points: [
            "`len`, `min`, `max`, `sum`, `count`, `index`, `in`.",
            "`sort()` changes the list in place. `sorted(nums)` returns a new list.",
            "Comprehension: `squares = [n * n for n in range(5)]`. Add a filter with `if`.",
          ],
        },
      ],
      flashcards: [
        { front: "What does `items[-1]` return?", back: "The last element. Negative indexes count backward from the end, starting at -1.", topic: "Index" },
        { front: "Does slicing change the original list?", back: "No. `nums[1:4]` builds a new list. Methods like `sort`, `append`, and `pop` do change the original.", topic: "Slice" },
        { front: "append vs extend?", back: "`append([1, 2])` nests a list as one item. `extend([1, 2])` adds 1 and 2 as separate items.", topic: "Methods" },
        { front: "What is the end index in a slice?", back: "Exclusive. `nums[1:4]` returns indexes 1, 2, and 3.", topic: "Slice" },
        { front: "sort() vs sorted()?", back: "`sort()` mutates and returns None. `sorted()` returns a new sorted list and leaves the original alone.", topic: "Methods" },
        { front: "Write a comprehension of even numbers from 0 to 8.", back: "`[n for n in range(9) if n % 2 == 0]`", topic: "Comprehension" },
      ],
      quiz: [
        { question: "Given `a = [10, 20, 30, 40]`, what is `a[1:3]`?", answer: "`[20, 30]`", explanation: "Start at index 1, stop before index 3." },
        { question: "What does `[].append` vs a mistaken `+` with a non-list look like?", answer: "`append` takes one object. To join lists use `extend` or `+` with another list.", explanation: "`[1] + 2` raises TypeError. `[1] + [2]` works." },
        { question: "What does `pop(0)` do?", answer: "Removes and returns the first item.", explanation: "With no argument, `pop()` takes the last item." },
        { question: "Why might you copy a list before sorting a view of it?", answer: "`sort()` reorders the original. Copy first, or use `sorted()`.", explanation: "`new = old.copy()` is a shallow copy." },
      ],
    },
  },
  {
    id: "python-tuples",
    track: "Python",
    title: "Tuples",
    blurb: "Immutable ordered records: packing, unpacking, and when a tuple beats a list.",
    level: "Core",
    keywords: ["tuple", "immutable", "unpack", "hashable", "parentheses"],
    kit: {
      title: "Python tuples",
      summary:
        "A tuple is an ordered, immutable collection written with parentheses. It can mix types, supports indexing and slicing, and is the usual way to return several values from a function.\n\nUse a tuple when the data should stay fixed: a coordinate, a date, a row you do not want a caller to edit. Because a tuple of immutable items can be hashed, it can also be a dictionary key.",
      reviewer: [
        {
          heading: "Creating tuples",
          points: [
            "`point = (10, 20)`, `empty = ()`, `single = (10,)` — the comma makes a one-item tuple, not the parentheses.",
            "`packed = 1, 2, 3` is a tuple even without parentheses.",
            "`person = (\"Ada\", 21, \"Dev\")` can mix types.",
          ],
        },
        {
          heading: "What you can and cannot do",
          points: [
            "Index and slice like a list: `fruits[0]`, `fruits[-1]`.",
            "You can concatenate and repeat: `(1, 2) + (3,)` and `(\"Hi\",) * 3`.",
            "You cannot assign `point[0] = 1`. That raises TypeError.",
          ],
        },
        {
          heading: "Unpacking",
          points: [
            "`x, y, z = point` binds each item.",
            "Functions often `return name, score` and the caller unpacks both.",
            "Swap is `a, b = b, a`.",
          ],
        },
        {
          heading: "When to choose a tuple",
          points: [
            "The record should not change, or you want a cheap fixed sequence.",
            "You need a dictionary key or a set member (items themselves must be hashable).",
            "Methods are limited: `count` and `index`. For sorting, `sorted(t)` returns a list.",
          ],
        },
      ],
      flashcards: [
        { front: "How do you write a one-item tuple?", back: "`(10,)` with a trailing comma. `(10)` is just the number 10 in parentheses.", topic: "Syntax" },
        { front: "Are tuples mutable?", back: "No. You cannot add, remove, or replace items. Build a new tuple instead.", topic: "Core" },
        { front: "Name the two tuple methods.", back: "`count(value)` and `index(value)`.", topic: "Methods" },
        { front: "What does unpacking `x, y = (3, 4)` do?", back: "Assigns 3 to x and 4 to y. The number of names must match the number of items.", topic: "Unpack" },
        { front: "When can a tuple be a dict key?", back: "When every item inside it is hashable, such as numbers, strings, or other such tuples. A tuple containing a list cannot.", topic: "Hashable" },
        { front: "Tuple or list for a to-do the user will edit?", back: "A list. Tuples are the wrong tool once the collection must change.", topic: "Choice" },
      ],
      quiz: [
        { question: "What is the type of `(10)`?", answer: "`int`, not a tuple.", explanation: "Add a comma: `(10,)`." },
        { question: "What does `sorted((3, 1, 2))` return?", answer: "The list `[1, 2, 3]`.", explanation: "`sorted` always returns a list." },
        { question: "Why are tuples a common function return?", answer: "You can hand back several fixed values and unpack them in one line.", explanation: "`lat, lon = locate()`." },
        { question: "Does `t[0]` work on a tuple?", answer: "Yes. Tuples are ordered and indexed from 0.", explanation: "Immutability blocks assignment, not reading." },
      ],
    },
  },
  {
    id: "python-dicts",
    track: "Python",
    title: "Dictionaries",
    blurb: "Key to value maps: safe lookup, update, and how they differ from lists.",
    level: "Core",
    keywords: ["dict", "dictionary", "key", "value", "get", "json", "mapping"],
    kit: {
      title: "Python dictionaries",
      summary:
        "A dictionary stores data as key to value pairs inside curly braces. Keys are unique and hashable, usually strings. Values can be anything. Lookup by key is the point: you ask for `student[\"name\"]` instead of remembering an index.\n\nModern Python keeps insertion order. Treat that as a convenience, not as a reason to use a dict when you really wanted a list.",
      reviewer: [
        {
          heading: "Create and read",
          points: [
            "`student = {\"name\": \"Ava\", \"age\": 21, \"course\": \"Python\"}`.",
            "`student[\"name\"]` raises KeyError if the key is missing. `student.get(\"grade\", \"N/A\")` returns the default instead.",
            "`\"name\" in student` checks keys, not values.",
          ],
        },
        {
          heading: "Change",
          points: [
            "`student[\"city\"] = \"Delhi\"` adds a key. Assigning an existing key replaces the value.",
            "`update` merges another mapping. `pop(\"age\")` removes a key and returns its value.",
            "`del student[\"age\"]` deletes. `clear()` empties the dict.",
          ],
        },
        {
          heading: "Loop and build",
          points: [
            "`for key, value in student.items():` walks pairs. `.keys()` and `.values()` exist too.",
            "`setdefault` inserts a default only when the key is absent.",
            "`dict.fromkeys([\"a\", \"b\"], 0)` builds a new dict of those keys.",
          ],
        },
        {
          heading: "Dict vs list vs tuple",
          points: [
            "Dict: labeled data. List: ordered items you will change. Tuple: ordered items that stay fixed.",
            "Keys must be unique. A second assignment to the same key overwrites.",
            "Great for configs, records, counters, and JSON-like payloads.",
          ],
        },
      ],
      flashcards: [
        { front: "What does `.get(\"grade\", \"N/A\")` return when the key is missing?", back: "The default `\"N/A\"`, and it does not raise.", topic: "Lookup" },
        { front: "Are duplicate keys allowed?", back: "No. The latest assignment wins and the earlier value is replaced.", topic: "Keys" },
        { front: "How do you test that a key exists?", back: "`\"name\" in student`. This checks keys, not values.", topic: "Lookup" },
        { front: "What does `items()` give you?", back: "Key-value pairs you can unpack in a for loop.", topic: "Loop" },
        { front: "Is a dictionary mutable?", back: "Yes. You can add, replace, and delete pairs.", topic: "Core" },
        { front: "Does Python remember insertion order?", back: "Yes, since Python 3.7 it is part of the language. Do not rely on it as a sorted order.", topic: "Order" },
      ],
      quiz: [
        { question: "What happens on `student[\"missing\"]` if that key was never set?", answer: "KeyError.", explanation: "Use `.get` when absence is normal." },
        { question: "How do you add a new pair for city?", answer: "`student[\"city\"] = \"Delhi\"`.", explanation: "The same syntax updates an existing key." },
        { question: "Which structure fits a list of unique tags with no labels?", answer: "A set, or a list if order and duplicates matter. A dict needs keys.", explanation: "Dicts shine when each value has a name." },
        { question: "What does `pop` return?", answer: "The value that was stored under that key, after removing the pair.", explanation: "Pass a default if the key might be missing." },
      ],
    },
  },
  {
    id: "python-functions",
    track: "Python",
    title: "Functions",
    blurb: "def, parameters, return versus print, and the habits that keep functions small.",
    level: "Core",
    keywords: ["function", "def", "return", "parameter", "argument", "lambda"],
    kit: {
      title: "Python functions",
      summary:
        "A function is a named block you define with `def` and run by calling it. Parameters are the names inside the definition. Arguments are the values you pass in the call.\n\n`return` hands a value back to the caller. `print` only shows text and gives back `None`. Small functions that return useful values are easier to test and reuse than ones that do five jobs and print as they go.",
      reviewer: [
        {
          heading: "Shape of a function",
          points: [
            "`def greet(name):` then an indented body. Call it with `greet(\"Ava\")`.",
            "A docstring on the first line documents the purpose.",
            "If there is no `return`, the function returns `None`.",
          ],
        },
        {
          heading: "Arguments",
          points: [
            "Positional: `add(3, 5)` fills parameters in order.",
            "Keyword: `greet(name=\"Ava\", age=22)` names them.",
            "Defaults: `def welcome(name=\"Guest\")`. Put required parameters first.",
          ],
        },
        {
          heading: "Return vs print",
          points: [
            "`print` writes to the screen and returns None. You cannot usefully write `message = print(\"Hi\")`.",
            "`return` stops the function and sends a value back.",
            "A function can return a tuple to hand back several results.",
          ],
        },
        {
          heading: "Kinds you will meet",
          points: [
            "Built-ins such as `len`, `print`, `range`, `sum` are already there.",
            "You write your own with `def`. A `lambda` is a one-expression anonymous function.",
            "A recursive function calls itself and needs a base case so it stops.",
          ],
        },
      ],
      flashcards: [
        { front: "Parameter or argument?", back: "A parameter is the name in the definition. An argument is the value passed in the call.", topic: "Terms" },
        { front: "What does a function return if you never use return?", back: "`None`.", topic: "Return" },
        { front: "Why is `result = print(\"Hi\")` a trap?", back: "`print` returns None. The text is shown, but `result` is None, not \"Hi\".", topic: "Return" },
        { front: "Where do default arguments belong?", back: "After parameters that have no default.", topic: "Defaults" },
        { front: "What is a lambda?", back: "A small anonymous function for a single expression, often passed to `sorted` or `map`.", topic: "Lambda" },
        { front: "What must a recursive function have?", back: "A base case that stops the recursion, plus a step that moves toward it.", topic: "Recursion" },
      ],
      quiz: [
        { question: "What is the value of `greet` if the function prints but does not return?", answer: "`None`.", explanation: "Display and return are different jobs." },
        { question: "Rewrite `def add(a, b): print(a + b)` so the sum can be reused.", answer: "`def add(a, b): return a + b`.", explanation: "The caller decides whether to print." },
        { question: "Which call uses a keyword argument? `greet(\"Ava\")` or `greet(name=\"Ava\")`?", answer: "`greet(name=\"Ava\")`.", explanation: "The first is positional." },
        { question: "Name one reason to keep a function small.", answer: "It is easier to name, test, and reuse.", explanation: "If you need \"and\" in the name, it may be doing two jobs." },
      ],
    },
  },
  {
    id: "python-imports",
    track: "Python",
    title: "Imports",
    blurb: "Bring in modules the four common ways, and avoid the mistakes that break runs.",
    level: "Core",
    keywords: ["import", "module", "from", "alias", "pip", "package"],
    kit: {
      title: "Python imports",
      summary:
        "`import` loads code that already exists so you do not rewrite it. Built-in modules such as `math`, `random`, `os`, `datetime`, and `json` ship with Python. Third-party packages such as `requests` or `pandas` need to be installed first.\n\nPut imports at the top of the file, import only what you need, and prefer a clear name over `from module import *`.",
      reviewer: [
        {
          heading: "Four styles",
          points: [
            "`import math` then `math.sqrt(25)`. The module name stays visible.",
            "`from math import sqrt` then `sqrt(25)`.",
            "`import numpy as np` gives a shorter alias. `from math import pi as p` aliases one name.",
          ],
        },
        {
          heading: "Your own files",
          points: [
            "A file `helper.py` with `def hello(): ...` is imported from `my_program.py` with `import helper`.",
            "Both files should sit where Python can find them, often the same folder while you are learning.",
            "This is how you split a big program into smaller parts.",
          ],
        },
        {
          heading: "Built-in vs third-party",
          points: [
            "Built-ins come with the interpreter. No install step.",
            "Third-party libraries are installed, usually with `pip install package`.",
            "A notebook or editor can be using a different Python than the terminal. Match them if import fails.",
          ],
        },
        {
          heading: "Mistakes",
          points: [
            "`ModuleNotFoundError` usually means a typo, the wrong environment, or a package that is not installed.",
            "Avoid `from module import *`. It hides where names came from and can overwrite your own.",
            "You cannot call `sqrt` after only `import math` unless you write `math.sqrt`.",
          ],
        },
      ],
      flashcards: [
        { front: "After `import math`, how do you call square root?", back: "`math.sqrt(25)`.", topic: "Style" },
        { front: "After `from math import sqrt`, how do you call it?", back: "`sqrt(25)`.", topic: "Style" },
        { front: "What does `import numpy as np` change?", back: "You use the shorter name `np` instead of `numpy`.", topic: "Alias" },
        { front: "Why avoid `from module import *`?", back: "It dumps every public name into your file, which causes clashes and makes code harder to trace.", topic: "Practice" },
        { front: "What error means Python cannot find the module?", back: "`ModuleNotFoundError`.", topic: "Errors" },
        { front: "Do third-party packages ship with Python?", back: "No. Install them first. Built-in modules do not need that.", topic: "Packages" },
      ],
      quiz: [
        { question: "Which import lets you write `pi` with no prefix?", answer: "`from math import pi`.", explanation: "`import math` requires `math.pi`." },
        { question: "Where should imports usually go?", answer: "At the top of the file.", explanation: "Readers see dependencies before the logic." },
        { question: "You wrote `import random` and then `randint(1, 6)`. What happens?", answer: "NameError. Call `random.randint(1, 6)`, or import the name directly.", explanation: "Importing the module does not copy its functions into your namespace." },
        { question: "How do you use a function `hello` defined in `helper.py`?", answer: "`import helper` then `helper.hello()`, if the file is on the import path.", explanation: "Same idea as a built-in module." },
      ],
    },
  },
  {
    id: "python-files",
    track: "Python",
    title: "Files",
    blurb: "Paths, open modes, with-blocks, pathlib, and everyday folder tasks.",
    level: "Core",
    keywords: ["file", "open", "path", "pathlib", "read", "write", "csv", "directory"],
    kit: {
      title: "Python files",
      summary:
        "A file path tells Python where a file lives. `open` reads or writes it. Always prefer `with open(...) as f`, which closes the file even if something fails.\n\n`pathlib.Path` is the modern way to join paths and read text without hand-building slash strings. The `os` module still covers exists, rename, list, and remove.",
      reviewer: [
        {
          heading: "Modes",
          points: [
            "`\"r\"` read text (default). `\"w\"` write, which creates or overwrites. `\"a\"` append.",
            "`\"x\"` create only if the file does not exist. `\"b\"` binary. `\"+\"` read and write.",
            "Text mode is the default. Pass `encoding=\"utf-8\"` when you care about characters.",
          ],
        },
        {
          heading: "The with pattern",
          points: [
            "`with open(\"notes.txt\", \"r\", encoding=\"utf-8\") as f: content = f.read()`.",
            "Line by line: `for line in f: ...`. Call `strip()` to drop the newline.",
            "Write with `f.write(\"Hello\\n\")`. Write mode wipes existing content.",
          ],
        },
        {
          heading: "Folders and pathlib",
          points: [
            "`os.path.exists`, `getsize`, `listdir`. `os.makedirs(\"data/reports\", exist_ok=True)`.",
            "`Path(\"data\") / \"input.txt\"` joins path parts cleanly on every operating system.",
            "`path.read_text()` and `path.write_text()` cover the simple cases.",
          ],
        },
        {
          heading: "Practical habits",
          points: [
            "Prefer raw strings or pathlib so Windows backslashes do not become escape characters.",
            "CSV: the `csv` module. JSON: the `json` module. Do not parse those by hand.",
            "Catch `FileNotFoundError` and `PermissionError` when the path comes from a user.",
          ],
        },
      ],
      flashcards: [
        { front: "Which mode overwrites a file?", back: "`\"w\"`. Use `\"a\"` to add to the end instead.", topic: "Modes" },
        { front: "Why use `with open`?", back: "It closes the file for you, including when an error is raised inside the block.", topic: "Safety" },
        { front: "What does `f.read()` return?", back: "The whole file as one string in text mode.", topic: "Read" },
        { front: "How do you join folders with pathlib?", back: "`Path(\"data\") / \"reports\" / \"out.txt\"`.", topic: "Paths" },
        { front: "What is a relative path?", back: "A path resolved from the current working directory, such as `notes.txt`. An absolute path starts from the drive or filesystem root.", topic: "Paths" },
        { front: "Which module reads CSV rows without you splitting commas yourself?", back: "The `csv` module.", topic: "Formats" },
      ],
      quiz: [
        { question: "What happens to existing text if you open with mode `\"w\"`?", answer: "It is truncated. The file starts empty.", explanation: "Use `\"a\"` to keep it." },
        { question: "Why can `\"C:\\\\Users\\\\notes.txt\"` be painful?", answer: "Backslash is an escape character in normal strings.", explanation: "Use a raw string `r\"...\"` or pathlib." },
        { question: "What exception is typical when the file is missing?", answer: "`FileNotFoundError`.", explanation: "Check `Path.exists()` if absence is expected." },
        { question: "Does a `for line in f` loop include newline characters?", answer: "Yes. `line.strip()` removes the trailing newline and surrounding whitespace.", explanation: "Strip only when you want that." },
      ],
    },
  },
  {
    id: "python-flow",
    track: "Python",
    title: "Conditions and loops",
    blurb: "if, elif, else, for, while, and break, continue, pass.",
    level: "Starter",
    keywords: ["if", "elif", "else", "for", "while", "break", "continue", "loop", "range"],
    kit: {
      title: "Conditions and loops",
      summary:
        "Conditions choose a path. Loops repeat a path. Together they are most of the control you need before functions and data structures get interesting.\n\nPython has no switch in older versions; `if` / `elif` / `else` is the everyday tool. `for` walks a sequence. `while` repeats until a test fails. `break` leaves the loop, `continue` skips to the next pass, and `pass` does nothing.",
      reviewer: [
        {
          heading: "Branches",
          points: [
            "`if` runs when its test is true. `elif` tries another test. `else` runs when nothing above matched.",
            "Comparisons and `and` / `or` / `not` build the test. Parentheses help when a test gets noisy.",
            "Indent the body. Mixing tabs and spaces is a real bug, not a style quibble.",
          ],
        },
        {
          heading: "Loops",
          points: [
            "`for i in range(5)` yields 0, 1, 2, 3, 4. The stop value is excluded.",
            "`for fruit in fruits` gives you each item, so you often do not need an index.",
            "`while count < 3` needs something inside that moves toward the end, or it never stops.",
          ],
        },
        {
          heading: "break, continue, pass",
          points: [
            "`break` exits the nearest loop immediately.",
            "`continue` skips the rest of this pass and starts the next one.",
            "`pass` is a placeholder so a block can exist before you fill it in.",
          ],
        },
        {
          heading: "Pitfalls",
          points: [
            "A missing colon after `if` or `for` is a syntax error.",
            "An overly clever condition is harder to debug than two named booleans.",
            "`range(10)` is not a list until you wrap it. It is a lightweight sequence of numbers.",
          ],
        },
      ],
      flashcards: [
        { front: "What values does `range(3)` produce?", back: "0, 1, and 2. The stop is excluded.", topic: "range" },
        { front: "When does `else` on an if run?", back: "When every `if` and `elif` test above it was false.", topic: "if" },
        { front: "What is the difference between break and continue?", back: "`break` leaves the loop. `continue` skips the rest of the current pass only.", topic: "Control" },
        { front: "What does pass do?", back: "Nothing. It holds a place where Python requires a statement.", topic: "Control" },
        { front: "Why can a while loop run forever?", back: "The condition never becomes false. Update a counter or use a break.", topic: "while" },
        { front: "Do you need an index to walk a list?", back: "No. `for item in items` is the direct form. Use `enumerate` if you also need the index.", topic: "for" },
      ],
      quiz: [
        { question: "How many times does `for i in range(5)` print if the body always prints?", answer: "5 times, for i equal to 0 through 4.", explanation: "Stop is exclusive." },
        { question: "A program should stop a search as soon as it finds a match. Which statement?", answer: "`break`.", explanation: "`continue` would only skip to the next item." },
        { question: "What does this print? `for i in range(4):` then `if i == 2: continue` then `print(i)`.", answer: "0, 1, and 3.", explanation: "2 is skipped, not used to exit." },
        { question: "Which branch handles \"none of the tests matched\"?", answer: "`else`.", explanation: "`elif` is another positive test." },
      ],
    },
  },
  {
    id: "python-strings",
    track: "Python",
    title: "Strings",
    blurb: "Immutable text: indexes, slices, and the methods used in real cleaning.",
    level: "Core",
    keywords: ["string", "str", "slice", "upper", "strip", "immutable", "f-string"],
    kit: {
      title: "Python strings",
      summary:
        "A string is a sequence of characters in quotes. It is ordered, so indexing and slicing work, but it is immutable: you cannot assign `text[0] = \"A\"`. Methods return a new string.\n\nMost cleaning is a chain of small methods: strip whitespace, change case, replace a piece, split into a list, or test a prefix.",
      reviewer: [
        {
          heading: "Quotes and indexes",
          points: [
            "Single, double, or triple quotes. Triple quotes span lines.",
            "`text[0]` is the first character. `text[-1]` is the last.",
            "Slices use the same rules as lists and do not change the original.",
          ],
        },
        {
          heading: "Build new strings",
          points: [
            "Concatenation: `\"Ada\" + \" Lovelace\"`. Repetition: `\"ha\" * 3`.",
            "f-strings: `f\"Hello, {name}\"`. This is the default formatting style.",
            "To \"change\" a character, build a new string with a slice or `replace`.",
          ],
        },
        {
          heading: "Methods worth memorizing",
          points: [
            "`upper`, `lower`, `capitalize`, `title`, `strip`, `replace`, `split`, `join`.",
            "`startswith`, `endswith`, `find`, `count`, `isdigit`, `isalpha`.",
            "`split` returns a list. `\", \".join(words)` turns a list of strings back into one string.",
          ],
        },
        {
          heading: "Immutability",
          points: [
            "`text[0] = \"Y\"` raises TypeError.",
            "Methods do not edit in place. Save the result: `clean = raw.strip()`.",
            "Strings can be dict keys because they cannot change.",
          ],
        },
      ],
      flashcards: [
        { front: "Can you change one character inside a string?", back: "No. Strings are immutable. Build a new string with slicing or `replace`.", topic: "Core" },
        { front: "What does `\"  hi \".strip()` return?", back: "`\"hi\"`. Strip removes surrounding whitespace, not interior spaces.", topic: "Methods" },
        { front: "What does `\"hello\".find(\"l\")` return?", back: "`2`, the first index. If it is missing, `find` returns -1.", topic: "Methods" },
        { front: "split vs join?", back: "`split` breaks one string into a list. `join` builds one string from a list, using the separator you call it on.", topic: "Methods" },
        { front: "How do you interpolate a variable?", back: "`f\"Total: {total}\"`.", topic: "Format" },
        { front: "What is `text[-1]`?", back: "The last character.", topic: "Index" },
      ],
      quiz: [
        { question: "Why does `greet[0] = \"Y\"` fail?", answer: "Strings cannot be modified in place.", explanation: "Assign a new string instead." },
        { question: "What is `\"Python\"[1:4]`?", answer: "`\"yth\"`.", explanation: "Indexes 1, 2, and 3." },
        { question: "How do you check that a filename ends in `.py`?", answer: "`name.endswith(\".py\")`.", explanation: "Case matters unless you normalize with `lower()` first." },
        { question: "What does `\" \".join([\"a\", \"b\"])` produce?", answer: "`\"a b\"`.", explanation: "The string before `.join` is the separator." },
      ],
    },
  },
  {
    id: "python-libraries",
    track: "Python",
    title: "Standard libraries",
    blurb: "math, random, datetime, and time: the functions beginners actually call.",
    level: "Core",
    keywords: ["math", "random", "datetime", "time", "sqrt", "sleep", "library"],
    kit: {
      title: "math, random, datetime, time",
      summary:
        "The standard library is code that ships with Python. `math` covers everyday numeric work, `random` draws pseudo-random values, `datetime` handles dates, and `time` covers timestamps and pauses.\n\nThese four modules show up in scripts long before you need NumPy or pandas. Import the module, then call `module.function`.",
      reviewer: [
        {
          heading: "math",
          points: [
            "`sqrt`, `pow`, `factorial`, `ceil`, `floor`, `log`.",
            "Constants: `math.pi` and `math.e`.",
            "`sin`, `cos`, `tan` take radians, not degrees. `math.radians` converts.",
          ],
        },
        {
          heading: "random",
          points: [
            "`random()` is a float from 0.0 up to but not including 1.0.",
            "`randint(a, b)` includes both ends. `uniform(a, b)` is a float in that range.",
            "`choice(seq)`, `sample(seq, k)` for unique picks, `shuffle(seq)` in place.",
          ],
        },
        {
          heading: "datetime",
          points: [
            "`datetime.now()` and `date.today()`.",
            "`strftime` formats a datetime. `strptime` parses a string into one.",
            "`timedelta(days=7)` adds or subtracts a duration.",
          ],
        },
        {
          heading: "time",
          points: [
            "`time.time()` is seconds since the Unix epoch. Useful for rough timing.",
            "`time.sleep(seconds)` pauses the program.",
            "`ctime` and `strftime` turn a timestamp into text. `gmtime` is UTC.",
          ],
        },
      ],
      flashcards: [
        { front: "Does `random.randint(1, 6)` include 6?", back: "Yes. Both endpoints are included, unlike `range`.", topic: "random" },
        { front: "What does `math.floor(3.7)` return?", back: "`3`. `ceil(3.2)` returns `4`.", topic: "math" },
        { front: "How do you format a datetime as year-month-day?", back: "`dt.strftime(\"%Y-%m-%d\")`.", topic: "datetime" },
        { front: "How do you parse `\"2000-04-25\"`?", back: "`datetime.strptime(\"2000-04-25\", \"%Y-%m-%d\")`.", topic: "datetime" },
        { front: "What does `time.sleep(2)` do?", back: "Pauses execution for about two seconds.", topic: "time" },
        { front: "Does `random.shuffle` return a new list?", back: "No. It shuffles the list in place and returns None.", topic: "random" },
      ],
      quiz: [
        { question: "What is `math.sqrt(16)`?", answer: "`4.0`.", explanation: "`sqrt` returns a float." },
        { question: "Which call picks one entry from a list named colors?", answer: "`random.choice(colors)`.", explanation: "`sample(colors, 1)` returns a one-item list instead." },
        { question: "How do you get a datetime one week from `now`?", answer: "`now + timedelta(days=7)`.", explanation: "Import both `datetime` and `timedelta` from the datetime module, or use `datetime.timedelta`." },
        { question: "Are trig functions in `math` using degrees?", answer: "No. They use radians.", explanation: "Convert with `math.radians(180)`." },
      ],
    },
  },
  {
    id: "aws-iam",
    track: "AWS",
    title: "AWS IAM",
    blurb: "Users, groups, roles, and policies. Who can do what, and why deny wins.",
    level: "Exam",
    keywords: ["iam", "policy", "role", "user", "group", "least privilege", "aws"],
    kit: {
      title: "AWS IAM",
      summary:
        "IAM is the global service that decides who can call AWS and on which resources. It is free to use. The working idea is least privilege: grant only what a task needs.\n\nUsers are long-term identities. Groups collect users so you can attach permissions once. Roles are assumed for temporary credentials, which is how EC2, Lambda, and cross-account access should work. Policies are JSON documents that allow or deny actions.",
      reviewer: [
        {
          heading: "The five pieces",
          points: [
            "Users: people or apps with long-term credentials.",
            "Groups: a set of users. Permissions live on the group.",
            "Roles: an identity that is assumed. No long-term access keys.",
            "Policies: JSON allow or deny. Identity-based policies attach to users, groups, and roles. Resource-based policies attach to a resource such as an S3 bucket.",
          ],
        },
        {
          heading: "How a decision is made",
          points: [
            "If any applicable policy has an explicit Deny, the request is denied.",
            "Otherwise, if an Allow matches, the request is allowed.",
            "Otherwise it is denied. IAM is deny-by-default.",
          ],
        },
        {
          heading: "Policy shape",
          points: [
            "A statement has Effect, Action, and Resource. Version is usually `2012-10-17`.",
            "Actions look like `s3:GetObject`. Resources are ARNs.",
            "Permission boundaries and SCPs can cap the maximum, even if a policy allows more.",
          ],
        },
        {
          heading: "Exam habits",
          points: [
            "Prefer roles for AWS services and for anything that would otherwise store an access key.",
            "Prefer groups over attaching the same policy to many users one by one.",
            "Never hard-code keys in source. An explicit deny anywhere beats an allow.",
          ],
        },
      ],
      flashcards: [
        { front: "Is IAM regional or global?", back: "Global. Users, groups, roles, and policies are not created inside one region.", topic: "Core" },
        { front: "What is the order of policy evaluation?", back: "Explicit deny wins. Then explicit allow. If neither matches, the request is denied by default.", topic: "Logic" },
        { front: "User vs role credentials?", back: "A user can have long-term access keys. A role provides temporary credentials when it is assumed.", topic: "Identities" },
        { front: "Where do you attach a bucket policy?", back: "To the bucket. That is a resource-based policy. An identity policy is attached to a user, group, or role.", topic: "Policies" },
        { front: "Does IAM have a separate charge?", back: "No. You are not billed for IAM itself.", topic: "Cost" },
        { front: "Why use a group for developers?", back: "You attach the right policies once and add or remove people without editing each user.", topic: "Groups" },
      ],
      quiz: [
        { question: "A policy allows s3:GetObject and another policy denies it. What happens?", answer: "Deny.", explanation: "Explicit deny overrides allow." },
        { question: "An EC2 instance needs to read an S3 bucket. What should you attach?", answer: "An IAM role with a read policy, associated with the instance.", explanation: "Do not put access keys on the instance." },
        { question: "What does a policy look like?", answer: "A JSON document of statements with Effect, Action, and Resource.", explanation: "Effect is Allow or Deny." },
        { question: "No policy mentions the action you called. Is it allowed?", answer: "No. The default is deny.", explanation: "Something must explicitly allow it, and nothing may explicitly deny it." },
      ],
    },
  },
  {
    id: "aws-ec2",
    track: "AWS",
    title: "AWS EC2",
    blurb: "Virtual servers: AMI, instance types, security groups, EBS, and stop versus terminate.",
    level: "Exam",
    keywords: ["ec2", "ebs", "ami", "security group", "instance", "spot", "reserved"],
    kit: {
      title: "AWS EC2",
      summary:
        "EC2 rents virtual servers by the second. You pick an AMI (the template: OS and software), an instance type (CPU, memory, network), storage, and a security group that filters traffic.\n\nYou pay for the instance while it runs, for EBS storage whether or not the instance is stopped, and for data transfer. Stop keeps the EBS volumes. Terminate deletes the instance. Instance-store data does not survive a stop.",
      reviewer: [
        {
          heading: "Pieces",
          points: [
            "Instance: the virtual server. AMI: the image you boot.",
            "Instance type families to remember: general t/m, compute c, memory r/x, storage i/d, GPU p/g.",
            "Key pair: the private key you keep, used for SSH. The public half sits on the instance.",
            "Security group: stateful virtual firewall on the instance. EBS: persistent block storage. Elastic IP: a static public address you own.",
          ],
        },
        {
          heading: "Pricing",
          points: [
            "On-Demand: no commitment, highest flexibility.",
            "Reserved or Savings Plans: commit to 1 or 3 years for a lower rate.",
            "Spot: unused capacity at a discount, which AWS can reclaim.",
            "Rough cost: instance + EBS + data transfer. Prices differ by region.",
          ],
        },
        {
          heading: "Lifecycle and storage",
          points: [
            "Pending, running, stopping, stopped, terminated.",
            "Stop: you are not billed for compute, EBS remains, public IP usually changes unless you use an Elastic IP.",
            "Terminate: the instance is deleted. Root EBS is deleted by default unless you turned delete-on-termination off.",
            "EBS persists. Instance store is fast local disk and is gone when the instance stops or fails.",
          ],
        },
        {
          heading: "Security habits",
          points: [
            "Security groups allow rules only, and they are stateful. Return traffic is allowed automatically.",
            "Network ACLs are on the subnet, can deny, and are stateless.",
            "Use a role for AWS API calls. Encrypt EBS when the data matters. Open SSH only to the addresses that need it.",
          ],
        },
      ],
      flashcards: [
        { front: "What is an AMI?", back: "An Amazon Machine Image: the template of OS and software used to launch an instance.", topic: "Core" },
        { front: "Stop vs terminate?", back: "Stop shuts the instance down and keeps EBS data. Terminate deletes the instance.", topic: "Lifecycle" },
        { front: "Does EBS survive a stop?", back: "Yes. EBS is persistent block storage. Instance-store volumes do not.", topic: "Storage" },
        { front: "Is a security group stateful?", back: "Yes. If you allow inbound, the response is allowed outbound without a second rule.", topic: "Network" },
        { front: "Which family letter is the usual exam hint for compute optimized?", back: "`c`, such as c5. Memory optimized is `r` or `x`. General purpose is `t` or `m`.", topic: "Types" },
        { front: "What is Spot for?", back: "Fault-tolerant work that can be interrupted, in exchange for a lower price.", topic: "Price" },
      ],
      quiz: [
        { question: "You stop an instance to save money. What still costs money?", answer: "Attached EBS volumes, and Elastic IPs you are not using on a running instance.", explanation: "Compute charges stop. Storage does not." },
        { question: "Where do you put a temporary AWS permission for an instance?", answer: "On an instance profile / IAM role.", explanation: "Not in a file of access keys." },
        { question: "Default user for SSH to Amazon Linux?", answer: "`ec2-user`.", explanation: "Ubuntu images often use `ubuntu`." },
        { question: "Can a security group explicitly deny an IP?", answer: "No. It is allow-only. Use a network ACL to deny.", explanation: "Anything not allowed is implicitly denied." },
      ],
    },
  },
  {
    id: "aws-s3",
    track: "AWS",
    title: "AWS S3",
    blurb: "Object storage: buckets, keys, storage classes, versioning, and public-access mistakes.",
    level: "Exam",
    keywords: ["s3", "bucket", "object", "glacier", "versioning", "lifecycle", "storage"],
    kit: {
      title: "AWS S3",
      summary:
        "S3 stores objects, not a filesystem you mount by default. A bucket is the container. An object is the bytes plus metadata, addressed by a key. Bucket names are globally unique. The service is regional, but you reach it over the web.\n\nDurability of standard storage is designed around 11 nines. That is not the same as availability. New buckets are private. Public access is a choice you have to make, and a common exam trap.",
      reviewer: [
        {
          heading: "Names",
          points: [
            "Bucket: container. Object: file-like data. Key: the object name, which can look like a path.",
            "Version ID appears when versioning is on. Metadata is information about the object.",
            "A bucket lives in one region you choose at creation.",
          ],
        },
        {
          heading: "Classes",
          points: [
            "Standard: frequent access. Intelligent-Tiering: unknown or changing access patterns.",
            "Standard-IA and One Zone-IA: infrequent access. One Zone keeps a single availability zone and costs less.",
            "Glacier Instant, Flexible, and Deep Archive: colder data, from milliseconds to hours of retrieval. Deep Archive is the cheapest and slowest.",
          ],
        },
        {
          heading: "Features",
          points: [
            "Versioning keeps old copies in the same bucket, including delete markers.",
            "Lifecycle rules transition or expire objects. Replication copies to another bucket: CRR across regions, SRR in the same region.",
            "Block Public Access, bucket policy, IAM, and encryption (SSE-S3, SSE-KMS, SSE-C). Prefer TLS in transit.",
          ],
        },
        {
          heading: "Differences that get tested",
          points: [
            "Bucket versus object: folder-like container versus the thing stored.",
            "IAM policy is on an identity. Bucket policy is on the bucket.",
            "Versioning is history in one bucket. Replication is a copy in another bucket.",
            "You pay for storage, requests, and data transfer out. Rates depend on class and region.",
          ],
        },
      ],
      flashcards: [
        { front: "Is an S3 bucket name unique to your account or to all of AWS?", back: "Globally unique across AWS, even though the bucket itself sits in one region.", topic: "Core" },
        { front: "Durability versus availability?", back: "Durability is how rarely AWS expects to lose the object. Availability is whether you can read it right now. They are not the same number.", topic: "Exam" },
        { front: "What does versioning protect?", back: "Overwrites and deletes. Old versions remain until a lifecycle rule or a permanent delete removes them.", topic: "Versioning" },
        { front: "CRR vs SRR?", back: "Cross-region replication copies to a bucket in another region. Same-region replication stays in the region.", topic: "Replication" },
        { front: "Are new buckets public?", back: "No. Block Public Access and default privacy mean a new bucket is not a website until you deliberately open it.", topic: "Security" },
        { front: "What is a key?", back: "The object name inside the bucket. Prefixes like `images/cat.jpg` are just part of the key, not real folders.", topic: "Core" },
      ],
      quiz: [
        { question: "You need the previous copy after someone uploaded the same key again. What feature?", answer: "Versioning.", explanation: "Replication would not by itself keep the old version in the source bucket." },
        { question: "Logs you almost never read should move to a cheaper class after 30 days. What do you use?", answer: "A lifecycle rule.", explanation: "It can transition storage class or expire the object." },
        { question: "Which policy type is attached to a user?", answer: "An identity-based IAM policy.", explanation: "A bucket policy is attached to the bucket." },
        { question: "Cheapest class for data you can wait hours to retrieve?", answer: "Glacier Deep Archive.", explanation: "Instant Retrieval is for archives you still might need immediately." },
      ],
    },
  },
  {
    id: "aws-vpc",
    track: "AWS",
    title: "AWS VPC",
    blurb: "Your private network: subnets, route tables, IGW, NAT, security groups, and NACLs.",
    level: "Exam",
    keywords: ["vpc", "subnet", "igw", "nat", "nacl", "security group", "cidr", "route"],
    kit: {
      title: "AWS VPC",
      summary:
        "A VPC is your isolated network inside a region. You choose the IP range, split it into subnets, and decide with route tables where packets go.\n\nPublic subnets have a route to an internet gateway. Private subnets do not. A NAT gateway lets private instances start outbound connections without accepting inbound ones from the internet. Security groups guard instances. Network ACLs guard subnets.",
      reviewer: [
        {
          heading: "Pieces",
          points: [
            "VPC: the network, regional. Subnet: a slice of the CIDR in one availability zone.",
            "Route table: rules for where traffic goes. IGW: the door to the internet.",
            "NAT gateway: outbound internet for private subnets. Security group: stateful instance firewall. NACL: stateless subnet firewall.",
            "Elastic IP, VPC peering, VPN, Direct Connect, and gateway endpoints are how you connect further.",
          ],
        },
        {
          heading: "Public vs private",
          points: [
            "Public subnet: route `0.0.0.0/0` to the IGW. Used for load balancers, bastions, NAT.",
            "Private subnet: no direct route to the IGW. Used for app servers and databases.",
            "Spread subnets across AZs. One subnet cannot span AZs. A VPC cannot span regions.",
          ],
        },
        {
          heading: "SG vs NACL",
          points: [
            "Security group: instance level, stateful, allow rules only, all rules evaluated.",
            "NACL: subnet level, stateless, allow and deny, rules numbered and checked in order.",
            "Because NACLs are stateless, return traffic needs its own rule.",
          ],
        },
        {
          heading: "Addresses",
          points: [
            "A /24 has 2^(32-24) = 256 addresses. AWS reserves 5 in every subnet, so 251 are usable.",
            "Reserved: network address, VPC router, DNS, a future-use address, and broadcast.",
            "Memory line: IGW is in and out for a public subnet. NAT is out only for a private subnet. SG is the stateful guardian. NACL is the numbered border list.",
          ],
        },
      ],
      flashcards: [
        { front: "Does a subnet span availability zones?", back: "No. A subnet is in one AZ. A VPC spans all AZs in its region.", topic: "Scope" },
        { front: "What makes a subnet public?", back: "A route to an internet gateway, plus instances that have public IPs.", topic: "Routing" },
        { front: "What is a NAT gateway for?", back: "Outbound internet from a private subnet. It does not allow the internet to start connections in.", topic: "NAT" },
        { front: "Stateful or stateless: security group and NACL?", back: "Security group is stateful. NACL is stateless.", topic: "Firewalls" },
        { front: "How many usable IPv4 addresses are in a /26 subnet?", back: "2^(32-26) - 5 = 64 - 5 = 59.", topic: "CIDR" },
        { front: "Can a security group deny a specific IP?", back: "No. It only has allow rules. Use a NACL to deny.", topic: "Firewalls" },
      ],
      quiz: [
        { question: "Where should a database usually sit?", answer: "In a private subnet, with no route to the internet gateway.", explanation: "App servers or a bastion reach it inside the VPC." },
        { question: "You allow inbound HTTP on a NACL. Return traffic fails. Why?", answer: "NACLs are stateless, so the ephemeral return ports also need an allow rule.", explanation: "Security groups would have allowed the return automatically." },
        { question: "Which gateway lets a private instance download a patch?", answer: "A NAT gateway (or NAT instance) in a public subnet, with the private route table pointing at it.", explanation: "An IGW route would make the subnet public if instances also have public IPs." },
        { question: "Is a VPC global?", answer: "No. A VPC is regional.", explanation: "IAM is global. VPC, subnets, and EC2 are not." },
      ],
    },
  },
  {
    id: "aws-rds",
    track: "AWS",
    title: "AWS RDS",
    blurb: "Managed relational databases, Multi-AZ, read replicas, backups, and Aurora.",
    level: "Exam",
    keywords: ["rds", "aurora", "multi-az", "read replica", "mysql", "postgres", "backup"],
    kit: {
      title: "AWS RDS",
      summary:
        "RDS runs a relational database without you patching the operating system or replacing disks. You choose an engine, a size, and storage. AWS handles backups, patching, and monitoring.\n\nMulti-AZ keeps a synchronous standby in another availability zone for failover. A read replica is an asynchronous copy you query to scale reads. They solve different problems. Aurora is the AWS-native engine with a distributed storage layer and faster replica story.",
      reviewer: [
        {
          heading: "Why RDS",
          points: [
            "Managed MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, or Aurora.",
            "Automatic backups, snapshots, patching, and monitoring.",
            "You still design schema, indexes, and SQL. RDS is not serverless SQL by itself; Aurora Serverless is a separate option.",
          ],
        },
        {
          heading: "Availability and reads",
          points: [
            "Multi-AZ: synchronous standby. Automatic failover. The standby is not for your read traffic.",
            "Read replica: asynchronous. You can read from it. It can be cross-region. Failover to it is a promotion you initiate, unless you are in an Aurora-specific setup.",
            "Put the database in private subnets across AZs. Security groups decide who can connect.",
          ],
        },
        {
          heading: "Backups",
          points: [
            "Automated backups are on by default and support point-in-time restore. Retention is 1 to 35 days.",
            "Manual snapshots stay until you delete them.",
            "Turn on deletion protection for anything you would hate to drop.",
          ],
        },
        {
          heading: "Aurora vs classic RDS",
          points: [
            "Aurora storage is distributed and replicated across AZs, with faster replica attach.",
            "Classic RDS storage is EBS. Aurora usually costs more and scales reads further.",
            "Exam shorthand: Multi-AZ is for staying up. Read replica is for read scale. Aurora is the high-performance AWS engine.",
          ],
        },
      ],
      flashcards: [
        { front: "Is the Multi-AZ standby used for SELECT queries?", back: "No. It is for automatic failover. Use a read replica to scale reads.", topic: "HA" },
        { front: "Synchronous or asynchronous: Multi-AZ standby?", back: "Synchronous. Read replicas are asynchronous.", topic: "HA" },
        { front: "How long can automated backup retention be?", back: "1 to 35 days.", topic: "Backup" },
        { front: "What does point-in-time restore use?", back: "Automated backups plus transaction logs, so you can restore to a time inside the retention window.", topic: "Backup" },
        { front: "Name two engines RDS supports besides Aurora.", back: "MySQL and PostgreSQL. Also MariaDB, Oracle, and SQL Server.", topic: "Engines" },
        { front: "Where should an RDS instance live in a VPC?", back: "Private subnets. Do not give the database a public route unless you have a rare, deliberate reason.", topic: "Network" },
      ],
      quiz: [
        { question: "The primary database fails. What takes over in a Multi-AZ deployment?", answer: "The synchronous standby becomes the new primary automatically.", explanation: "The endpoint is updated so apps keep the same address." },
        { question: "You need reporting queries without slowing the writer. What do you add?", answer: "A read replica.", explanation: "Multi-AZ alone does not give you a second readable database." },
        { question: "Do manual snapshots expire with the backup retention setting?", answer: "No. They remain until you delete them.", explanation: "Automated backups follow the retention period." },
        { question: "What is Aurora's main storage difference?", answer: "Storage is distributed across AZs and shared with replicas, rather than a single EBS volume tied to one instance.", explanation: "That is why replicas are faster to add." },
      ],
    },
  },
  {
    id: "aws-lambda",
    track: "AWS",
    title: "AWS Lambda",
    blurb: "Run code on events. Timeouts, memory, cold starts, and how the bill is calculated.",
    level: "Exam",
    keywords: ["lambda", "serverless", "cold start", "event", "iam role", "timeout"],
    kit: {
      title: "AWS Lambda",
      summary:
        "Lambda runs your function when an event arrives and scales the number of copies for you. You do not provision servers. You pay for requests and for the time they run, multiplied by the memory you assigned.\n\nThe function needs an execution role. Triggers include API Gateway, S3, queues, streams, and schedules. The hard timeout cap is 15 minutes, so Lambda is for short work, not a server you SSH into.",
      reviewer: [
        {
          heading: "How a call works",
          points: [
            "You upload code and set a handler, such as `index.handler`.",
            "An event source invokes the function with a JSON event.",
            "Lambda assumes the execution role, runs the code, and can write logs to CloudWatch.",
          ],
        },
        {
          heading: "Limits to remember",
          points: [
            "Memory: 128 MB to 10,240 MB. CPU scales with memory.",
            "Timeout: up to 15 minutes. Ephemeral disk `/tmp` up to 10 GB.",
            "Environment variables hold config. Do not hard-code secrets; use Secrets Manager or Parameter Store.",
          ],
        },
        {
          heading: "Cold start and concurrency",
          points: [
            "A cold start is the delay when a new environment has to be created.",
            "A warm start reuses an environment and is faster.",
            "Reserved concurrency caps how many copies run. Provisioned concurrency keeps environments ready, which cuts cold starts and costs more.",
          ],
        },
        {
          heading: "Sync, async, and price",
          points: [
            "Synchronous: the caller waits. API Gateway to Lambda is the usual example.",
            "Asynchronous: the event is queued. S3, SNS, and EventBridge are typical. Failures can go to a dead-letter queue.",
            "Cost is roughly request charges plus duration times memory. A free tier exists. More memory can shorten runtime, so it is not always more expensive.",
          ],
        },
      ],
      flashcards: [
        { front: "What is the maximum Lambda timeout?", back: "15 minutes.", topic: "Limits" },
        { front: "What identity does the function use to call other AWS services?", back: "An IAM execution role. Not an access key in the code.", topic: "Security" },
        { front: "Cold start vs warm start?", back: "Cold start creates a new execution environment. Warm start reuses one and skips that setup.", topic: "Performance" },
        { front: "What two things dominate the Lambda bill?", back: "Number of requests, and GB-seconds (duration times memory allocated).", topic: "Price" },
        { front: "Name a synchronous and an asynchronous trigger.", back: "API Gateway is synchronous. S3, SNS, and EventBridge are asynchronous.", topic: "Events" },
        { front: "Where do failed async events go if you configure it?", back: "A dead-letter queue, typically SQS or SNS, or an on-failure destination.", topic: "Errors" },
      ],
      quiz: [
        { question: "A video encode takes 40 minutes. Is Lambda a fit?", answer: "No. The timeout cap is 15 minutes.", explanation: "Use a longer-running compute option for that job." },
        { question: "You raise memory and the function finishes much faster. Can the bill go down?", answer: "Yes. You pay for memory times time, so a shorter run can cost less.", explanation: "Measure it. It is not guaranteed." },
        { question: "How should a function read a database password?", answer: "From a secret store at runtime, via the execution role. Not from source code.", explanation: "Environment variables are better than source, and a secret store is better than a plain env var for credentials." },
        { question: "What does provisioned concurrency buy you?", answer: "Pre-initialized environments so cold starts are rare.", explanation: "You pay for the provisioned capacity even when idle." },
      ],
    },
  },
  {
    id: "aws-cloudwatch",
    track: "AWS",
    title: "AWS CloudWatch",
    blurb: "Metrics, logs, alarms, and how CloudWatch differs from CloudTrail.",
    level: "Exam",
    keywords: ["cloudwatch", "cloudtrail", "alarm", "metric", "logs", "monitoring"],
    kit: {
      title: "AWS CloudWatch",
      summary:
        "CloudWatch is the monitoring service. It collects metrics and logs, draws dashboards, and fires alarms when a number crosses a line you set. Those alarms can notify people through SNS or trigger automation such as Auto Scaling or Lambda.\n\nCloudTrail is a different service. It records who called which API. CloudWatch tells you how the system is behaving. Exams love that split.",
      reviewer: [
        {
          heading: "Metrics",
          points: [
            "A metric is a number over time, such as CPUUtilization or RequestCount, inside a namespace.",
            "Dimensions are labels that slice a metric, such as InstanceId.",
            "A datapoint is one measurement. Period is how often it is collected. Statistic is Average, Sum, Minimum, or Maximum.",
            "Standard resolution is 60 seconds. High resolution can be 1, 5, 10, or 30 seconds. Custom metrics are published by you.",
          ],
        },
        {
          heading: "Logs",
          points: [
            "A log group holds retention and permissions. A log stream is one source's sequence of events.",
            "The CloudWatch agent ships logs and extra metrics from EC2 or on-premises servers.",
            "Logs Insights queries logs. Retention is configurable because storage costs money.",
          ],
        },
        {
          heading: "Alarms",
          points: [
            "States: OK, ALARM, and INSUFFICIENT_DATA.",
            "An alarm watches one metric (or a metric math expression) and can notify SNS or trigger Auto Scaling, EC2 actions, or Systems Manager.",
            "Missing data is why you see INSUFFICIENT_DATA. It is not the same as ALARM.",
          ],
        },
        {
          heading: "CloudWatch vs CloudTrail",
          points: [
            "CloudWatch: performance and health. Numbers and log lines.",
            "CloudTrail: an audit of API calls and account activity. Who did what.",
            "A CPU alarm is CloudWatch. \"Who called DeleteBucket\" is CloudTrail.",
          ],
        },
      ],
      flashcards: [
        { front: "Metric or log: CPU percentage?", back: "Metric. Logs are event text.", topic: "Terms" },
        { front: "What are the three alarm states?", back: "OK, ALARM, and INSUFFICIENT_DATA.", topic: "Alarms" },
        { front: "Log group vs log stream?", back: "A group is the collection with retention. A stream is one sequence of events inside that group.", topic: "Logs" },
        { front: "What does CloudTrail record that CloudWatch does not?", back: "API activity: who made which call. CloudWatch watches performance, logs, and alarms.", topic: "Compare" },
        { front: "Default metric period for many AWS services?", back: "60 seconds. High-resolution custom metrics can be as fine as 1 second.", topic: "Metrics" },
        { front: "What can an alarm trigger besides an email?", back: "Auto Scaling, an EC2 action, or a Lambda workflow, usually via SNS or an alarm action.", topic: "Alarms" },
      ],
      quiz: [
        { question: "You want to know which IAM user disabled a trail. Which service?", answer: "CloudTrail.", explanation: "That is an API audit question, not a performance metric." },
        { question: "An alarm is gray and says there is not enough data. What state is that?", answer: "INSUFFICIENT_DATA.", explanation: "ALARM means the threshold was breached." },
        { question: "What is a dimension?", answer: "A name-value label that identifies which copy of a metric you mean, such as a specific instance.", explanation: "Namespace is the container, such as AWS/EC2." },
        { question: "Why set a log retention period?", answer: "So you do not pay to keep logs forever, and so old data is deleted on a schedule.", explanation: "Retention is configured on the log group." },
      ],
    },
  },
  {
    id: "html-structure",
    track: "HTML",
    title: "Page structure",
    blurb: "The document skeleton: doctype, html, head, body, and the tags every page needs.",
    level: "Starter",
    keywords: ["html", "doctype", "head", "body", "title", "meta"],
    kit: {
      title: "HTML page structure",
      summary:
        "HTML is the structure of a web page. The browser reads tags and builds a document from them. A page starts with a doctype, then an html element that holds head and body.\n\nHead is information about the page, such as the title and the character set. Body is what people see.",
      reviewer: [
        {
          heading: "Minimum page",
          points: [
            "`<!DOCTYPE html>` tells the browser to use the modern HTML parser.",
            "`<html lang=\"en\">` wraps the document. The lang attribute helps screen readers and translation.",
            "`<head>` holds metadata. `<body>` holds the visible content.",
          ],
        },
        {
          heading: "What belongs in head",
          points: [
            "`<meta charset=\"utf-8\">` so letters, accents, and symbols decode correctly.",
            "`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` so phones do not show a tiny desktop page.",
            "`<title>` is the tab label and the default name in search results. It is not a heading on the page.",
          ],
        },
        {
          heading: "Tags, elements, attributes",
          points: [
            "A tag is the markup, like `<p>`. An element is the tag plus its content.",
            "Attributes add detail: `<a href=\"/guides\">`. The attribute name is href. The value is the address.",
            "Void elements have no closing tag: `meta`, `img`, `br`, `input`.",
          ],
        },
      ],
      flashcards: [
        { front: "What does `<!DOCTYPE html>` do?", back: "It switches the browser into standards mode for modern HTML.", topic: "Skeleton" },
        { front: "Head or body: the visible heading?", back: "Body. Head is metadata, not the page content.", topic: "Skeleton" },
        { front: "What is the title element for?", back: "The browser tab and the default search-result label. It is not the on-page h1.", topic: "Head" },
        { front: "Why set charset to utf-8?", back: "So the browser decodes text correctly, including accents and symbols.", topic: "Head" },
        { front: "What does the viewport meta tag change on a phone?", back: "It makes the layout use the device width instead of a shrunken desktop page.", topic: "Head" },
        { front: "Name two void elements.", back: "`img` and `input`. They do not wrap content and have no closing tag.", topic: "Tags" },
      ],
      quiz: [
        { question: "Where does `<title>` go?", answer: "Inside `<head>`.", explanation: "The visible page title is usually an h1 in the body." },
        { question: "Which element wraps everything the visitor sees?", answer: "`<body>`.", explanation: "`<html>` wraps head and body together." },
        { question: "What attribute tells assistive tech the page language?", answer: "`lang` on the html element.", explanation: "Example: `<html lang=\"en\">`." },
        { question: "Is `<br>` required to have a closing tag?", answer: "No. It is a void element.", explanation: "You write `<br>` or `<br />`. There is no `</br>`." },
      ],
    },
  },
  {
    id: "html-text",
    track: "HTML",
    title: "Text, links, and images",
    blurb: "Headings, paragraphs, lists, anchors, and images with useful alt text.",
    level: "Starter",
    keywords: ["html", "h1", "anchor", "href", "img", "alt", "list"],
    kit: {
      title: "HTML text, links, and images",
      summary:
        "Most pages are headings, paragraphs, lists, links, and images. Use one h1 for the page topic, then h2 and h3 for sections. Do not pick a heading level just to change the font size.\n\nA link needs a real href. An image needs alt text that says what the image is for, or an empty alt when the image is decorative.",
      reviewer: [
        {
          heading: "Text",
          points: [
            "`h1` through `h6` are the outline. One h1 per page is the usual pattern.",
            "`p` is a paragraph. `strong` is importance. `em` is stress. They are not the same as bold and italic from a toolbar.",
            "`ul` is an unordered list. `ol` is ordered. Each item is an `li`.",
          ],
        },
        {
          heading: "Links",
          points: [
            "`<a href=\"notes.html\">Notes</a>` goes to another page. The text between the tags is the link label.",
            "Use a descriptive label. \"Click here\" tells nobody where the link goes.",
            "`href=\"#review\"` jumps to an element with `id=\"review\"` on the same page.",
          ],
        },
        {
          heading: "Images",
          points: [
            "`<img src=\"diagram.png\" alt=\"VPC with a public and a private subnet\">`.",
            "Alt text describes the information, not the file name.",
            "`alt=\"\"` is correct for a purely decorative image so screen readers skip it.",
          ],
        },
      ],
      flashcards: [
        { front: "Why not use h3 just because you want smaller text?", back: "Heading levels describe the outline. Size is a CSS job.", topic: "Text" },
        { front: "ul versus ol?", back: "`ul` is a bulleted list. `ol` is numbered. Items are `li` either way.", topic: "Text" },
        { front: "What makes an anchor a link?", back: "The `href` attribute. Without it, the `a` element is not a navigation link.", topic: "Links" },
        { front: "What should alt text say?", back: "The information the image carries. Not \"image\" and not the file name.", topic: "Images" },
        { front: "When is empty alt correct?", back: "When the image is decorative and the surrounding text already says everything.", topic: "Images" },
        { front: "How do you link to a spot on the same page?", back: "`href=\"#id\"` matching an element with that id.", topic: "Links" },
      ],
      quiz: [
        { question: "A page has two h1 elements that are unrelated topics. What is the problem?", answer: "The outline is unclear. Use one h1 for the page topic.", explanation: "Lower sections use h2 and h3." },
        { question: "Which is a better link label: \"click here\" or \"VPC notes\"?", answer: "\"VPC notes\".", explanation: "The label should say where the link goes." },
        { question: "An icon next to the word Save has no extra meaning. What alt do you use?", answer: "Empty alt: `alt=\"\"`.", explanation: "The word Save already names the control." },
        { question: "Which element wraps list items?", answer: "`ul` or `ol`. Each item is `li`.", explanation: "Do not put `li` directly in a paragraph." },
      ],
    },
  },
  {
    id: "html-forms",
    track: "HTML",
    title: "Forms",
    blurb: "Labels, inputs, buttons, and the difference between getting and posting data.",
    level: "Core",
    keywords: ["html", "form", "input", "label", "button", "get", "post"],
    kit: {
      title: "HTML forms",
      summary:
        "A form collects input and sends it somewhere. Every control needs a name if you want its value submitted, and a label if you want people and assistive tech to know what it is.\n\nThe label is tied to the control with `for` and `id`, or by wrapping the control. The button that submits the form is `type=\"submit\"`.",
      reviewer: [
        {
          heading: "The form element",
          points: [
            "`action` is where the data goes. `method` is `get` or `post`.",
            "GET puts the fields in the URL. Use it for searches. POST sends a body. Use it when data should not sit in the address bar.",
            "Each successful control is submitted as name plus value.",
          ],
        },
        {
          heading: "Controls",
          points: [
            "`<label for=\"email\">Email</label>` pairs with `<input id=\"email\" name=\"email\" type=\"email\">`.",
            "Useful types: text, email, password, number, checkbox, radio, date.",
            "`required` blocks submit until the field is filled. The browser checks type=\"email\" for a rough email shape.",
          ],
        },
        {
          heading: "Buttons",
          points: [
            "`<button type=\"submit\">` sends the form.",
            "`type=\"button\"` does nothing by itself. Use it for scripted actions.",
            "`type=\"reset\"` clears the form. It is rarely what you want.",
          ],
        },
      ],
      flashcards: [
        { front: "GET or POST for a login password?", back: "POST. GET would put the password in the URL.", topic: "Method" },
        { front: "How is a label tied to an input?", back: "`for` on the label matches `id` on the input, or the label wraps the input.", topic: "Labels" },
        { front: "Which attribute is submitted: id or name?", back: "`name`. The id is for the label and for scripts. The name is the field key.", topic: "Fields" },
        { front: "What does type=\"email\" check?", back: "A rough email shape before submit. It is not proof the inbox exists.", topic: "Validation" },
        { front: "submit versus button?", back: "`type=\"submit\"` sends the form. `type=\"button\"` does not, unless script handles it.", topic: "Buttons" },
        { front: "Why give radio buttons the same name?", back: "They become one group. Only one value in that group is chosen.", topic: "Fields" },
      ],
      quiz: [
        { question: "A search box should update the URL. Which method?", answer: "GET.", explanation: "The query stays shareable and bookmarkable." },
        { question: "The label does not focus the field when clicked. What is missing?", answer: "The label's `for` does not match the input's `id`, and it does not wrap the input.", explanation: "Either connection works." },
        { question: "An input has an id but no name. Will its value be submitted?", answer: "No.", explanation: "Submission uses the name attribute." },
        { question: "Which button type sends the form?", answer: "`type=\"submit\"`.", explanation: "A button with no type defaults to submit inside a form, but writing the type is clearer." },
      ],
    },
  },
  {
    id: "html-semantic",
    track: "HTML",
    title: "Semantic layout",
    blurb: "header, nav, main, section, article, and footer instead of a pile of divs.",
    level: "Core",
    keywords: ["html", "semantic", "header", "nav", "main", "section", "footer", "div"],
    kit: {
      title: "Semantic HTML",
      summary:
        "Semantic elements say what a region is. A header is the top matter of a page or section. Nav is the navigation. Main is the primary content, once per page. A footer is closing matter.\n\nDiv and span are still correct when nothing more specific fits. They should not be the only structure on the page.",
      reviewer: [
        {
          heading: "Landmarks",
          points: [
            "`header`, `nav`, `main`, and `footer` are landmarks. Screen-reader users jump between them.",
            "One `main` per page. Extra nav blocks are fine if each is a real group of links.",
            "`section` groups a topic and usually has a heading. `article` is a piece that could stand alone, such as a lesson or a post.",
          ],
        },
        {
          heading: "When to use div",
          points: [
            "Use `div` for a styling hook or a script target when no semantic element fits.",
            "Use `span` the same way inside a line of text.",
            "Do not replace a button with a clickable div. A button is keyboard-focusable and announced as a button.",
          ],
        },
        {
          heading: "A small page",
          points: [
            "Order: header with the title, nav with the lesson links, main with the lesson, footer with a short note.",
            "Inside main, an article can hold the lesson and sections can hold \"remember\" and \"try this\".",
            "CSS still does the columns and spacing. HTML only names the regions.",
          ],
        },
      ],
      flashcards: [
        { front: "How many main elements should a page have?", back: "One. It marks the primary content.", topic: "Landmarks" },
        { front: "section versus article?", back: "A section is a topic inside a page. An article can stand alone, such as a post or a lesson.", topic: "Regions" },
        { front: "When is a div the right choice?", back: "When you only need a box for layout or script and no semantic element fits.", topic: "Div" },
        { front: "Why not use a div as a button?", back: "A div is not focused or announced as a button unless you rebuild that behavior. Use button.", topic: "Controls" },
        { front: "What is a landmark?", back: "A region like main or nav that assistive tech can jump to.", topic: "Landmarks" },
        { front: "Does semantic HTML replace CSS?", back: "No. HTML names the regions. CSS places and styles them.", topic: "Roles" },
      ],
      quiz: [
        { question: "Where do the lesson links go: nav or main?", answer: "Nav.", explanation: "Main holds the lesson itself." },
        { question: "A blog post that could be syndicated on its own is which element?", answer: "`article`.", explanation: "A section is a smaller topic grouping, often with a heading." },
        { question: "You need a wrapper only so flexbox can space two cards. Which element?", answer: "`div`.", explanation: "Nothing more specific describes \"flex wrapper\"." },
        { question: "A clickable card that submits an action should be which element?", answer: "A `button`, or a link if it navigates.", explanation: "Do not use a div with an onclick and no keyboard support." },
      ],
    },
  },
];

export const LIBRARY: Pack[] = packs;

export function packById(id: string): Pack | undefined {
  return packs.find((pack) => pack.id === id);
}

export function searchPacks(query: string): Pack[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((term) => term.length > 1);
  if (terms.length === 0) return [];
  return packs
    .map((pack) => {
      const hay = [pack.title, pack.blurb, pack.track, pack.keywords.join(" "), pack.kit.summary]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((total, term) => total + (hay.includes(term) ? 1 : 0), 0);
      const titleHit = terms.some((term) => pack.title.toLowerCase().includes(term));
      return { pack, score: score + (titleHit ? 2 : 0) };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.pack);
}
