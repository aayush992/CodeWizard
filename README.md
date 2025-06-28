# 🧙‍♂️ CodeWizard

A modern educational compiler with web interface for learning compiler design and implementation.

## ✨ Features

- **Complete Compiler Pipeline**: Lexical analysis → Parsing → IR Generation → Code Generation
- **Web-Based Interface**: Interactive online compiler with real-time feedback
- **Educational Focus**: Perfect for learning compiler construction
- **Multiple Output Formats**: Assembly code, intermediate representation, and parse trees
- **Ready to Deploy**: Containerized with Docker and optimized for cloud deployment

## 🚀 Quick Start

### Option 1: Web Interface (Recommended)
```bash
# Clone the repository
git clone https://github.com/aayush992/CodeWizard.git
cd CodeWizard

# Start the backend server
cd backend
npm install
npm start

# Open web-interface-mockup.html in your browser
```

### Option 2: Command Line
```bash
# Build the compiler
cd src
make

# Compile a program
./compiler input.c -o output
```

### Option 3: Docker Deployment
```bash
# Run with Docker
docker-compose up --build

# Access at http://localhost:3000
```

## 🏗️ How It Works

CodeWizard implements a complete compiler pipeline with the following phases:

### 1. **Lexical Analysis** (`lexer.l`)
- **Input**: Source code text
- **Process**: Breaks code into tokens (keywords, identifiers, operators, literals)
- **Output**: Stream of tokens
- **Logic**: Uses Flex to define regular expressions for each token type

### 2. **Syntax Analysis** (`parser.y`)
- **Input**: Token stream from lexer
- **Process**: Builds Abstract Syntax Tree (AST) using grammar rules
- **Output**: Parse tree representing program structure
- **Logic**: Uses Bison to define context-free grammar and parsing rules

### 3. **Intermediate Representation** (`ir.c`, `ir.h`)
- **Input**: AST from parser
- **Process**: Converts high-level constructs to three-address code
- **Output**: Platform-independent intermediate code
- **Logic**: Simplifies complex expressions and control flow for easier code generation

### 4. **Code Generation** (`codegen.c`, `codegen.h`)
- **Input**: Intermediate representation
- **Process**: Translates IR to target assembly (x86)
- **Output**: Assembly code
- **Logic**: Handles register allocation, stack management, and instruction selection

### 5. **Web Interface Integration**
- **Backend** (`backend/server.js`): Express.js server that orchestrates compilation phases
- **Frontend** (`web-interface-mockup.html`): Interactive UI for code input and result visualization
- **API**: RESTful endpoints for compilation requests and phase-by-phase analysis

## 🧠 Core Logic & Algorithms

### **Symbol Table Management**
- Tracks variable declarations, types, and scopes
- Implements nested scope resolution
- Handles function parameter binding

### **Type Checking**
- Validates operations between compatible types
- Enforces language semantics (e.g., array bounds, function signatures)
- Provides meaningful error messages

### **Control Flow Analysis**
- Converts if-else, loops to conditional jumps
- Generates labels for branch targets
- Optimizes basic block structure

### **Register Allocation**
- Simple stack-based allocation strategy
- Handles register spilling when needed
- Manages function call conventions

## 🏗️ Project Architecture

```
CodeWizard/
├── src/                   # Core compiler implementation
│   ├── lexer.l           # Flex lexical analyzer
│   ├── parser.y          # Bison parser with grammar rules
│   ├── ir.c/h            # Intermediate representation generator
│   ├── codegen.c/h       # x86 assembly code generator
│   ├── main.c            # Command-line compiler driver
│   └── main_web.c        # Web interface integration
├── backend/               # Node.js web server
│   ├── server.js         # Express.js API server
│   ├── compiler-phases.js # Compilation phase handlers
│   └── package.json      # Node.js dependencies
├── tests/                 # Comprehensive test suite
└── web-interface-mockup.html # Interactive web UI
```

## 💻 Supported Language Features

- **Data Types**: int, float, bool, string, arrays
- **Operators**: Arithmetic, logical, comparison
- **Control Flow**: if-else, while, for loops
- **Functions**: Declaration and calls
- **Arrays**: Multi-dimensional support

## 🌐 Live Demo

Deploy instantly on Railway, Heroku, or any Docker-compatible platform.

## 📝 Example: Compilation Process

### Input Code:
```c
int main() {
    int x = 10;
    int y = 20;
    return x + y;
}
```

### Step-by-Step Compilation:

**1. Lexical Analysis Output:**
```
INT, IDENTIFIER(main), LPAREN, RPAREN, LBRACE,
INT, IDENTIFIER(x), ASSIGN, NUMBER(10), SEMICOLON,
INT, IDENTIFIER(y), ASSIGN, NUMBER(20), SEMICOLON,
RETURN, IDENTIFIER(x), PLUS, IDENTIFIER(y), SEMICOLON,
RBRACE
```

**2. Parse Tree (Simplified):**
```
Program
└── FunctionDecl(main)
    └── Block
        ├── VarDecl(x, int, 10)
        ├── VarDecl(y, int, 20)
        └── Return(x + y)
```

**3. Intermediate Representation:**
```
FUNCTION main
t1 = 10
x = t1
t2 = 20
y = t2
t3 = x + y
RETURN t3
```

**4. Generated Assembly:**
```assembly
main:
    push %rbp
    mov %rsp, %rbp
    movl $10, -4(%rbp)    # x = 10
    movl $20, -8(%rbp)    # y = 20
    movl -4(%rbp), %eax   # load x
    addl -8(%rbp), %eax   # add y
    pop %rbp
    ret
```

## 🔧 Implementation Details

### **Key Design Decisions:**

1. **Two-Pass Compilation**: Separates parsing from code generation for better error handling
2. **Three-Address Code IR**: Simplifies optimization and target code generation
3. **Stack-Based Runtime**: Simple memory management with function call frames
4. **Web API Integration**: RESTful design allows frontend flexibility

### **Error Handling Strategy:**
- **Lexical Errors**: Invalid characters, unterminated strings
- **Syntax Errors**: Grammar violations with line numbers
- **Semantic Errors**: Type mismatches, undeclared variables
- **Runtime Errors**: Array bounds, division by zero

### **Optimization Opportunities:**
- Constant folding during IR generation
- Dead code elimination
- Basic block optimization
- Register allocation improvements

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Interactive UI)
- **Backend**: Node.js, Express.js (API Server)
- **Compiler Core**: C, Flex (Lexer), Bison (Parser)
- **Build System**: Make, GCC toolchain
- **Deployment**: Docker, Railway-ready containerization

## 🎯 Educational Value

This project demonstrates:
- **Compiler Theory**: Complete implementation of compilation phases
- **Language Design**: Grammar definition and semantic analysis
- **System Programming**: Low-level code generation and memory management
- **Web Development**: Full-stack application with API design
- **DevOps**: Containerization and cloud deployment

## 📄 License

MIT License - feel free to use for educational purposes.
