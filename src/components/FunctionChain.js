import React, { useEffect, useRef, useState } from "react";
import FunctionBox from "./FunctionBox";

const initialFunctions = [
  { id: 1, equation: "x^2", nextFunction: 2 },
  { id: 2, equation: "2x+4", nextFunction: 4 },
  { id: 3, equation: "x^2+20", nextFunction: null },
  { id: 4, equation: "x-2", nextFunction: 5 },
  { id: 5, equation: "x/2", nextFunction: 3 },
];

const FunctionChain = () => {
  const [functions, setFunctions] = useState(initialFunctions);
  const [inputValue, setInputValue] = useState(0);
  const [outputValue, setOutputValue] = useState(0);
  const canvasRef = useRef(null);
  const boxRefs = useRef([]);

  const evaluateEquation = (equation, x) => {
    try {
      let modifiedEquation = equation
        // Handle cases like 2x
        .replace(/(\d+)x/g, `$1*(${x})`)
        // Handle cases like x2
        .replace(/x(\d+)/g, `(${x})*$1`)
        // Handle remaining x
        .replace(/x/g, `(${x})`)
        // Handle implicit multiplication with parentheses, e.g., 2(x+1)
        .replace(/(\d+)\(/g, "$1*(")
        // Handle implicit multiplication between parentheses, e.g., (x+1)(x-1)
        .replace(/\)\(/g, ")*(");

      return eval(modifiedEquation);
    } catch (error) {
      console.error("Error evaluating equation:", error);
      return x;
    }
  };

  const updateEquation = (id, newEquation) => {
    const validationRegex = /^[x0-9\+\-\*\/\^\s]+$/;
    if (validationRegex.test(newEquation)) {
      setFunctions((prevFunctions) =>
        prevFunctions.map((func) =>
          func.id === id ? { ...func, equation: newEquation } : func
        )
      );
    } else {
      console.error(
        "Invalid equation. Only x, numbers, and operators *, /, +, -, ^ are allowed."
      );
    }
  };

  const executeFunctionChain = (currentFunctionId, currentInput) => {
    const currentFunction = functions.find((f) => f.id === currentFunctionId);

    if (!currentFunction) return currentInput;

    const output = evaluateEquation(currentFunction.equation, currentInput);

    if (currentFunction.nextFunction) {
      // Call the next function recursively
      return executeFunctionChain(currentFunction.nextFunction, output);
    } else {
      return output;
    }
  };
  const calculateChain = () => {
    const finalResult = executeFunctionChain(1, inputValue);
    setOutputValue(finalResult);
  };

  useEffect(() => {
    calculateChain();
  }, [inputValue, functions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawConnections() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const containerRect = canvas.getBoundingClientRect();

      function drawStraightLine(start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }

      function drawCurvedLine(start, end) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const controlX = midX;
        const controlY = midY + 50;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
        ctx.stroke();
      }

      function drawSLine(start, end) {
        // const midX = (start.x + end.x) / 2;
        // ctx.beginPath();
        // ctx.moveTo(start.x, start.y);
        // ctx.bezierCurveTo(midX, start.y, midX, end.y, end.x, end.y);
        // ctx.stroke();
        const midX = (start.x + end.x) / 2;
        const verticalOffset = 50; // Adjust this value to control the S curve height

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(
          midX,
          start.y + verticalOffset, // First control point
          midX,
          end.y - verticalOffset, // Second control point
          end.x,
          end.y // End point
        );
        ctx.stroke();
      }

      function drawDShapedLine(start, end) {
        const controlPointOffset = 100; // Adjust this value to change the curve
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        // Create a D-shaped curve
        ctx.bezierCurveTo(
          start.x + controlPointOffset,
          start.y, // First control point
          start.x + controlPointOffset,
          end.y, // Second control point
          end.x,
          end.y // End point
        );

        ctx.stroke();
      }

      ctx.strokeStyle = "#B3C9FA";
      ctx.lineWidth = 5;

      // Input container output -> Box 1 input (straight line)
      drawStraightLine(
        {
          x:
            document
              .querySelector(".input-container .output")
              .getBoundingClientRect().right - containerRect.left,
          y:
            document
              .querySelector(".input-container .output")
              .getBoundingClientRect().top +
            document
              .querySelector(".input-container .output")
              .getBoundingClientRect().height /
              2 -
            containerRect.top,
        },
        {
          x:
            boxRefs.current[0].querySelector(".input").getBoundingClientRect()
              .left - containerRect.left,
          y:
            boxRefs.current[0].querySelector(".input").getBoundingClientRect()
              .top +
            boxRefs.current[0].querySelector(".input").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        }
      );

      // Box 1 output to Box 2 input
      drawCurvedLine(
        {
          x:
            boxRefs.current[0].querySelector(".output").getBoundingClientRect()
              .right - containerRect.left,
          y:
            boxRefs.current[0].querySelector(".output").getBoundingClientRect()
              .top +
            boxRefs.current[0].querySelector(".output").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        },
        {
          x:
            boxRefs.current[1].querySelector(".input").getBoundingClientRect()
              .left - containerRect.left,
          y:
            boxRefs.current[1].querySelector(".input").getBoundingClientRect()
              .top +
            boxRefs.current[1].querySelector(".input").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        }
      );

      // Box 2 output to Box 4 input (S-shape)
      drawSLine(
        {
          x:
            boxRefs.current[1].querySelector(".output").getBoundingClientRect()
              .right - containerRect.left,
          y:
            boxRefs.current[1].querySelector(".output").getBoundingClientRect()
              .top +
            boxRefs.current[1].querySelector(".output").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        },
        {
          x:
            boxRefs.current[3].querySelector(".input").getBoundingClientRect()
              .left - containerRect.left,
          y:
            boxRefs.current[3].querySelector(".input").getBoundingClientRect()
              .top +
            boxRefs.current[3].querySelector(".input").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        }
      );

      // Box 4 output to Box 5 input
      drawCurvedLine(
        {
          x:
            boxRefs.current[3].querySelector(".output").getBoundingClientRect()
              .right - containerRect.left,
          y:
            boxRefs.current[3].querySelector(".output").getBoundingClientRect()
              .top +
            boxRefs.current[3].querySelector(".output").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        },
        {
          x:
            boxRefs.current[4].querySelector(".input").getBoundingClientRect()
              .left - containerRect.left,
          y:
            boxRefs.current[4].querySelector(".input").getBoundingClientRect()
              .top +
            boxRefs.current[4].querySelector(".input").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        }
      );

      // Box 5 output to Box 3 input
      // Box 5 output to Box 3 input (D-shape)
      drawDShapedLine(
        {
          x:
            boxRefs.current[4].querySelector(".output").getBoundingClientRect()
              .right - containerRect.left,
          y:
            boxRefs.current[4].querySelector(".output").getBoundingClientRect()
              .top +
            boxRefs.current[4].querySelector(".output").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        },
        {
          x:
            boxRefs.current[2].querySelector(".input").getBoundingClientRect()
              .left - containerRect.left,
          y:
            boxRefs.current[2].querySelector(".input").getBoundingClientRect()
              .top +
            boxRefs.current[2].querySelector(".input").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        }
      );

      // Box 3 output to output container input (straight line)
      drawStraightLine(
        {
          x:
            boxRefs.current[2].querySelector(".output").getBoundingClientRect()
              .right - containerRect.left,
          y:
            boxRefs.current[2].querySelector(".output").getBoundingClientRect()
              .top +
            boxRefs.current[2].querySelector(".output").getBoundingClientRect()
              .height /
              2 -
            containerRect.top,
        },
        {
          x:
            document
              .querySelector(".output-container .input")
              .getBoundingClientRect().left - containerRect.left,
          y:
            document
              .querySelector(".output-container .input")
              .getBoundingClientRect().top +
            document
              .querySelector(".output-container .input")
              .getBoundingClientRect().height /
              2 -
            containerRect.top,
        }
      );
    }

    drawConnections();
    window.addEventListener("resize", drawConnections);

    return () => {
      window.removeEventListener("resize", drawConnections);
    };
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <div className="input-label">initial value of x</div>
        <div className="input-box">
          <input
            type="number"
            value={inputValue}
            name={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="w-[40%] flex justify-center items-center">
            <div className="dots">
              <div className="output"></div>
            </div>
          </div>
        </div>
      </div>
      {functions.map((func, index) => (
        <FunctionBox
          key={func.id}
          func={func}
          index={index}
          boxRefs={boxRefs}
          updateEquation={updateEquation}
        />
      ))}
      <div className="output-container">
        <div className="output-label">final output of y</div>
        <div className="output-box">
          <div className="w-[40%] flex justify-center items-center">
            <div className="dots">
              <div className="input"></div>
            </div>
          </div>
          <input type="number" value={outputValue} readOnly />
        </div>
      </div>
      <canvas ref={canvasRef} width="1300" height="700" />
    </div>
  );
};

export default FunctionChain;
