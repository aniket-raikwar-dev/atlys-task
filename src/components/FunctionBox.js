import React from "react";

const FunctionBox = ({ func, index, boxRefs, updateEquation }) => {
  const handleEquationChange = (e) => {
    updateEquation(func.id, e.target.value);
  };

  return (
    <div
      key={func.id}
      className="function-box"
      id={`box${index + 1}`}
      ref={(el) => (boxRefs.current[index] = el)}
    >
      <div className="z-10">
        <div className="function-head">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path>
          </svg>
          <p>Function {func.id}</p>
        </div>
        <div className="mt-4">
          <p className="equation-txt">Equation</p>
          <input
            className="equation-input"
            type="text"
            value={func.equation}
            onChange={handleEquationChange}
          />
        </div>
        <div className="mt-4">
          <p className="equation-txt">Next Function</p>
          <div className="function-input">
            <input
              type="text"
              value={
                func.nextFunction ? `Function ${func.nextFunction}` : "None"
              }
              disabled={true}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="input-output-box">
        <div className="flex items-center">
          <div className="dots mr-1">
            <div className="input"></div>
          </div>
          <p>input</p>
        </div>
        <div className="flex items-center">
          <p>output</p>
          <div className="dots ml-1">
            <div className="output"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionBox;
