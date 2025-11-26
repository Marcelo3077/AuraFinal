import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/Colors';

interface CameraCaptureProps {
    onCapture: (uri: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [preview, setPreview] = useState<string | null>(null);
    const cameraRef = useRef<CameraView | null>(null);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionTitle}>Camera permission needed</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant access</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
        if (photo?.uri) {
            setPreview(photo.uri);
            onCapture(photo.uri);
        }
    };

    return (
        <View style={styles.container}>
            {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}
            <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
                <View style={styles.cameraControls}>
                    <TouchableOpacity
                        onPress={() => setCameraType((prev) => (prev === 'back' ? 'front' : 'back'))}
                        style={styles.smallButton}
                    >
                        <Text style={styles.buttonText}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePicture} style={styles.button}>
                        <Text style={styles.buttonText}>Capture</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.card,
        marginTop: 12,
    },
    camera: {
        width: '100%',
        height: 240,
    },
    cameraControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    smallButton: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '700',
    },
    permissionContainer: {
        padding: 16,
        backgroundColor: Colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 10,
    },
    permissionTitle: {
        color: Colors.text,
        fontWeight: '700',
        fontSize: 16,
    },
    preview: {
        width: '100%',
        height: 180,
    },
});
