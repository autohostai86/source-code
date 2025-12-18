import { useEffect } from "react";

const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
    //   if (textAreaRef) {
    //     // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    //     textAreaRef.style.height = "0px";
    //     const scrollHeight = textAreaRef.scrollHeight;
        
  
    //     // We then set the height directly, outside of the render loop
    //     // Trying to set this with state or a ref will product an incorrect value.
    //     textAreaRef.style.height = scrollHeight + "px";
    //   }
    const adjustTextAreaHeight = () => {
        if (textAreaRef) {
          textAreaRef.style.height = "auto"; // Reset height to auto
          textAreaRef.style.height = `${textAreaRef.scrollHeight}px`; // Set height to scrollHeight
        }
      };
  
      if (textAreaRef) {
        textAreaRef.addEventListener("input", adjustTextAreaHeight);
        adjustTextAreaHeight(); // Adjust height initially
      }
  
      return () => {
        if (textAreaRef) {
          textAreaRef.removeEventListener("input", adjustTextAreaHeight);
        }
      };
    }, [textAreaRef, value]);
  };
  
  export default useAutosizeTextArea;