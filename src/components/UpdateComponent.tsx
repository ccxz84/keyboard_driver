import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');
import ModalComponent from './ModalComponent';

interface UpdateComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UpdateEvent {
  progress: number;
  statusMessage?: string;
}

const updateComponent: React.FC<UpdateComponentProps> = ({ isOpen, onClose })  => {
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
        ipcRenderer.send('request-update');

        ipcRenderer.on('update-event', (event, updateEvent: UpdateEvent) => {
            console.log(updateEvent.progress);
            setProgress(updateEvent.progress);
            if (updateEvent.statusMessage) {
                setStatusMessage(updateEvent.statusMessage);
            }
        });

        ipcRenderer.on('update-ended', () => {
            setStatusMessage('Update complete');
            setProgress(100);
        });

        ipcRenderer.on('update-grpc-error', (event, errorMessage: string) => {
            setStatusMessage(`Error: ${errorMessage}`);
        });

        // Clean up listeners on unmount
        return () => {
            ipcRenderer.removeAllListeners('update-event');
            ipcRenderer.removeAllListeners('update-ended');
            ipcRenderer.removeAllListeners('update-grpc-error');
        };
        }
    }, [isOpen]);

    return (
        <ModalComponent isOpen={isOpen} errorMessage={""}>
            <div>
                <h2>Updating: {progress}%</h2>
                <progress value={progress} max="100"></progress>
                {statusMessage && <p>{statusMessage}</p>}
                <div className="modal-buttons-container">
                    <button onClick={onClose} disabled={progress < 100}>확인</button>
                </div>
            </div>
        </ModalComponent>
    );
}

export default updateComponent;
