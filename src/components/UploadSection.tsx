import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, FolderOpen } from 'lucide-react';
import { parseFile } from '../utils/parseFile';
import { NetworkInterface } from '../types/network';

interface UploadSectionProps {
  onDataLoaded: (data: NetworkInterface[]) => void;
}

interface FileProcessResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

export default function UploadSection({ onDataLoaded }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [processResult, setProcessResult] = useState<FileProcessResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const accumulatedData = useRef<NetworkInterface[]>([]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const handleFolderInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const isSupportedFile = (fileName: string): boolean => {
    const lowerName = fileName.toLowerCase();
    return lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv') || lowerName.endsWith('.txt');
  };

  const processFiles = async (files: File[]) => {
    setIsLoading(true);
    setError('');
    setProcessResult(null);
    const newFileNames: string[] = [];
    const result: FileProcessResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    try {
      for (const file of files) {
        if (!isSupportedFile(file.name)) {
          result.skipped++;
          continue;
        }

        try {
          const data = await parseFile(file);
          if (data.length > 0) {
            accumulatedData.current = [...accumulatedData.current, ...data];
            newFileNames.push(file.name);
            result.success++;
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.failed++;
          result.errors.push(
            `${file.name}: ${err instanceof Error ? err.message : 'Gagal memproses'}`
          );
        }
      }

      if (result.success > 0) {
        setUploadedFiles([...uploadedFiles, ...newFileNames]);
        onDataLoaded(accumulatedData.current);
      }

      if (result.success > 0 || result.skipped > 0) {
        setProcessResult(result);
      }

      if (result.failed > 0 && result.success === 0) {
        setError(`Gagal memproses ${result.failed} file: ${result.errors.join('; ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses file');
      console.error('Error processing files:', err);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
    accumulatedData.current = [];
    onDataLoaded([]);
    setError('');
    setProcessResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Unggah File</h2>
        {uploadedFiles.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Hapus Semua
          </button>
        )}
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          Seret dan lepas file atau folder di sini
        </p>
        <p className="text-sm text-gray-500 mb-4">atau pilih:</p>
        <div className="flex gap-2 justify-center mb-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Pilih File
          </label>

          <input
            ref={folderInputRef}
            type="file"
            multiple
            webkitdirectory=""
            onChange={handleFolderInput}
            className="hidden"
            id="folder-upload"
          />
          <label
            htmlFor="folder-upload"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Pilih Folder
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Format yang didukung: .xlsx, .xls, .csv, .txt (file lain akan diabaikan)
        </p>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-blue-600">
          Memproses file...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {processResult && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <p className="font-medium mb-2">Hasil Pemrosesan:</p>
          <ul className="text-sm space-y-1">
            {processResult.success > 0 && (
              <li className="text-green-700">
                ✓ {processResult.success} file berhasil diproses
              </li>
            )}
            {processResult.skipped > 0 && (
              <li className="text-gray-700">
                ⊘ {processResult.skipped} file diabaikan (format tidak didukung atau kosong)
              </li>
            )}
            {processResult.failed > 0 && (
              <li className="text-red-700">
                ✗ {processResult.failed} file gagal diproses
              </li>
            )}
          </ul>
          {processResult.errors.length > 0 && (
            <div className="mt-2 text-xs text-red-600 space-y-1">
              {processResult.errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            File yang berhasil ({uploadedFiles.length}):
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {uploadedFiles.map((fileName, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                {fileName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
