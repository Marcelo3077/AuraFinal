import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

interface CameraCaptureProps {
    onCapture: (uri: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [preview, setPreview] = useState<string | null>(null);
    const [capturing, setCapturing] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);

    useEffect(() => {
        if (!permission && !permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    const takePicture = async () => {
        if (!cameraRef.current || capturing) return;
        
        setCapturing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({ 
                quality: 0.7, 
                base64: false 
            });
            
            if (photo?.uri) {
                setPreview(photo.uri);
                onCapture(photo.uri);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Error', 'Failed to capture photo. Please try again.');
        } finally {
            setCapturing(false);
        }
    };

    const pickFromGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                setPreview(result.assets[0].uri);
                onCapture(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select photo from gallery.');
        }
    };

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.permissionText}>Loading camera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionTitle}>Camera access needed</Text>
                <Text style={styles.permissionText}>
                    We need camera permission to capture service issues
                </Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]} 
                    onPress={pickFromGallery}
                >
                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {preview && (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: preview }} style={styles.preview} />
                    <TouchableOpacity 
                        style={styles.clearButton}
                        onPress={() => {
                            setPreview(null);
                            onCapture('');
                        }}
                    >
                        <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>
            )}
            
            <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
                <View style={styles.cameraControls}>
                    <TouchableOpacity
                        onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
                        style={styles.smallButton}
                        disabled={capturing}
                    >
                        <Text style={styles.buttonText}>Flip</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={takePicture} 
                        style={[styles.captureButton, capturing && styles.buttonDisabled]}
                        disabled={capturing}
                    >
                        {capturing ? (
                            <ActivityIndicator color={Colors.text} />
                        ) : (
                            <Text style={styles.captureButtonText}>📷</Text>
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={pickFromGallery}
                        style={styles.smallButton}
                        disabled={capturing}
                    >
                        <Text style={styles.buttonText}>Gallery</Text>
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    secondaryButton: {
        backgroundColor: Colors.secondary,
    },
    smallButton: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    captureButton: {
        backgroundColor: Colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    captureButtonText: {
        fontSize: 32,
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
        gap: 12,
        alignItems: 'center',
    },
    permissionTitle: {
        color: Colors.text,
        fontWeight: '700',
        fontSize: 16,
    },
    permissionText: {
        color: Colors.muted,
        fontSize: 14,
        textAlign: 'center',
    },
    previewContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    clearButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.danger,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
});