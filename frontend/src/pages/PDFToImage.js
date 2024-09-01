import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import axios from "axios";
import { Container } from "@mui/material";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./PDFToImage.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFToImage = () => {
  const [selectedOption, setSelectedOption] = useState("summary");
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [extractedInformation, setExtractedInformation] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false); // New state to track if a file has been uploaded

  useEffect(() => {
    const convertPdfToImages = async () => {
      if (!file) return;

      try {
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          const typedArray = new Uint8Array(event.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;

          setNumPages(pdf.numPages);

          const pages = [];
          const pages_api = [];
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
            const image = canvas.toDataURL("image/png");

            const cleanImage = image.replace("data:image/png;base64,", "");
            pages_api.push({ page: pageNum, cleanImage });

            pages.push({ page: pageNum, image });
          }
          setImages(pages);

          try {
            const response = await axios.post(
              "http://localhost:8000/extract_pdf/",
              {
                pdf: { pages_api },
              }
            );
            console.log("Server response:", response.data);
            if (response.data.extracted_information) {
              setExtractedInformation(response.data.extracted_information);
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                console.error("Server response error:", error.response.data);
                console.error("Status code:", error.response.status);
              } else if (error.request) {
                console.error("Request error:", error.request);
              } else {
                console.error("Error message:", error.message);
              }
            } else {
              console.error("Unexpected error:", error);
            }
          }
        };

        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error converting PDF to images:", error);
      }
    };

    convertPdfToImages();
  }, [file]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileUploaded(true); // Set fileUploaded to true when a file is uploaded
      setPageNumber(1);
    }
  };

  const handlePageChange = (delta) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = Math.max(
        1,
        Math.min(prevPageNumber + delta, numPages)
      );
      return newPageNumber;
    });
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <Container>
        {fileUploaded ? ( // Conditional rendering based on fileUploaded state
          <div className="pdf-main-div">
            <div className="pdf-page">
              {images.length > 0 && (
                <div>
                  <img
                    src={images.find((img) => img.page === pageNumber)?.image}
                    alt={`PDF Page ${pageNumber}`}
                    style={{
                      maxHeight: "60vh",
                      width: "95%",
                      objectFit: "contain",
                    }}
                  />
                  <br />
                  <button
                    onClick={() => handlePageChange(-1)}
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pageNumber >= numPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="extracted-data-disp-main">
              <div className="extracted-d-container">
                <ul className="text-font extracted-d-menu active">
                  <li className="extracted-d-item">
                    <span
                      className="extracted-d-link"
                      onClick={() => handleOptionClick("summary")}
                    >
                      Summary
                    </span>
                  </li>
                  <li className="extracted-d-item">
                    <span
                      className="extracted-d-link"
                      onClick={() => handleOptionClick("flashcards")}
                    >
                      Flashcards
                    </span>
                  </li>
                  <li className="extracted-d-item">
                    <span
                      className="extracted-d-link"
                      onClick={() => handleOptionClick("qna")}
                    >
                      Q&A
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                {selectedOption === "summary" && (
                  <div>
                    <p style={{ textAlign: "justify" }}>
                      {extractedInformation[pageNumber - 1]?.summary ||
                        "No summary available"}
                    </p>
                    <div>
                      {/* {extractedInformation[pageNumber - 1]?.formula?.map(
                        (formula, index) => (
                          <BlockMath key={index} math={formula} />
                        )
                      )} */}
                      {extractedInformation[pageNumber - 1]?.formula ||
                        "No formula available"}
                    </div>
                  </div>
                )}
                {selectedOption === "flashcards" && (
                  <div>
                    <h2>Coming Soon . . .</h2>
                    {/* Render flashcards here */}
                  </div>
                )}
                {selectedOption === "qna" && (
                  <div>
                    <h2>Q&A</h2>
                    {/* Render Q&A here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-btn">
            <form className="file-upload-form">
              <label htmlFor="file" className="file-upload-label">
                <div className="file-upload-design">
                  <svg viewBox="0 0 640 512" height="1em">
                    <defs>
                      <linearGradient
                        id="gradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#e848e5", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#5218fa", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                      fill="url(#gradient1)"
                    />
                  </svg>
                  <span className="upload-span">Upload PDF</span>
                </div>
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </form>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PDFToImage;
