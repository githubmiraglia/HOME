import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/PhotosUpload.css";
import { GLOBAL_BACKEND_URL } from "../App";
import GoBackButton from "../components/GoBackButton";
import { convertHeicToJpeg, logToBackend } from "../utils/utils";

interface Props {
  selectedYear: string;
  selectedSubfolder: string;
  onUploadComplete: () => void;
  onSubfolderChange: (folder: string) => void;
}

const PhotosUpload: React.FC<Props> = ({
  selectedYear,
  selectedSubfolder,
  onUploadComplete,
  onSubfolderChange,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [s3Folders, setS3Folders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    if (selectedYear) {
      fetchS3Folders();
    }
  }, [selectedYear]);

  const fetchS3Folders = async () => {
    try {
      const res = await axios.get(`${GLOBAL_BACKEND_URL}/upload/list-folders?year=${selectedYear}`);
      const data = res.data as { folders: string[] };
      logToBackend(`Fetched folders: ${JSON.stringify(data.folders)}`);
      setS3Folders(data.folders || []);
    } catch (err: any) {
      logToBackend(`Error fetching folders: ${err.message || err}`);
    }
  };

  const logToCheck = () => {
    logToBackend("AQUICK LOG CHECK");
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      logToBackend(`Selected ${files.length} files`);
      const originalFiles = Array.from(files);
      logToBackend("Converting HEIC files if any...");
      const convertedFiles = await convertHeicToJpeg(originalFiles);
      logToBackend(`Converted files: ${convertedFiles.map((f) => f.name).join(", ")}`);
      setLocalFiles(convertedFiles);
      const defaultSelected = new Set(convertedFiles.map((f) => f.name));
      setSelectedFiles(defaultSelected);
    }
  };

  const toggleFile = (filename: string) => {
    const newSet = new Set(selectedFiles);
    newSet.has(filename) ? newSet.delete(filename) : newSet.add(filename);
    setSelectedFiles(newSet);
  };

  const handleUpload = async () => {
    if (!selectedSubfolder || selectedFiles.size === 0) return;

    const formData = new FormData();
    for (const file of localFiles) {
      if (selectedFiles.has(file.name)) {
        formData.append("photos", file);
      }
    }

    formData.append("folder", selectedSubfolder);
    formData.append("year", selectedYear);

    logToBackend(`Uploading ${selectedFiles.size} files to year=${selectedYear}, folder=${selectedSubfolder}`);

    try {
      const config: any = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event: any) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setUploadProgress(percent);
        },
      };

      const res = await axios.post(
        `${GLOBAL_BACKEND_URL}/upload/photos`,
        formData,
        config
      );

      const data = res.data as any;
      const uploadedFilenames = Array.isArray(data.entries)
        ? data.entries.map((e: { filename: string }) => e.filename)
        : [];

      logToBackend(`Successfully uploaded: ${uploadedFilenames.join(", ")}`);

      await axios.post(`${GLOBAL_BACKEND_URL}/photo-index/add`, {
        year: selectedYear,
        folder: selectedSubfolder,
        filenames: uploadedFilenames,
      });

      setUploadProgress(100);
      setUploadDone(true);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      onUploadComplete();
    } catch (err: any) {
      logToBackend(`Upload failed: ${err.message || err}`);
    }
  };

  const handleNewFolder = async () => {
    const folderName = newFolderName.trim();
    if (!folderName) return;

    try {
      await axios.post(`${GLOBAL_BACKEND_URL}/upload/create-folder`, {
        year: selectedYear,
        folder: folderName,
      });

      logToBackend(`Created new folder: ${folderName} under ${selectedYear}`);

      onSubfolderChange(folderName);
      setNewFolderName("");
      await fetchS3Folders();
    } catch (err: any) {
      logToBackend(`Failed to create folder: ${err.message || err}`);
    }
  };

  return (
    <div className="photo-upload-container">
      <GoBackButton />

      <div className="photo-upload-left">
        <h3>Folders in {selectedYear}</h3>
        <ul className="photo-upload-folder-list">
          {s3Folders.map((folder) => (
            <li
              key={folder}
              className={folder === selectedSubfolder ? "selected" : ""}
              onClick={() => onSubfolderChange(folder)}
            >
              📁 {folder}
            </li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button onClick={handleNewFolder}>➕ Create & Select</button>

        {selectedFiles.size > 0 && !uploadDone && (
          <button className="upload-button" onClick={handleUpload}>
            Upload {selectedFiles.size} Photos
          </button>
        )}

        {uploadProgress > 0 && !uploadDone && (
          <div className="photo-upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        )}

        {uploadDone && (
          <div className="photo-upload-overlay">
            ✅ Upload complete!
            <button onClick={() => window.location.reload()}>Done</button>
          </div>
        )}
      </div>

      <div className="photo-upload-right">
        <h3 style={{ color: "#666" }}>Selected Images</h3>

        <label className="custom-file-upload">
          📂 Choose Images
          <input type="file" multiple accept="image/*" onChange={logToCheck} />
        </label>

        <div className="photo-upload-thumbnails">
          {localFiles.map((file) => (
            <div
              key={file.name}
              className="thumbnail-box"
              onClick={() => toggleFile(file.name)}
            >
              <input
                type="checkbox"
                checked={selectedFiles.has(file.name)}
                onChange={() => toggleFile(file.name)}
                className="thumbnail-checkbox"
              />
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="thumbnail-image"
              />
              <p>{file.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotosUpload;