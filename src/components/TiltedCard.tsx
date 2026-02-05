"use client"
import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TiltedCard.css';

interface TiltedCardProps {
    imageSrc?: string;
    altText?: string;
    captionText?: string;
    containerHeight?: string;
    containerWidth?: string;
    imageHeight?: string;
    imageWidth?: string;
    rotateAmplitude?: number;
    scaleOnHover?: number;
    showMobileWarning?: boolean;
    showTooltip?: boolean;
    displayOverlayContent?: boolean;
    overlayContent?: React.ReactNode;
    // Glare props
    glareColor?: string;
    glareOpacity?: number;
    glareAngle?: number;
    glareSize?: number;
    transitionDuration?: number;
    children?: React.ReactNode;
}

export default function TiltedCard({
    imageSrc,
    altText = "",
    captionText,
    containerHeight = "300px",
    containerWidth = "300px",
    imageHeight = "300px",
    imageWidth = "300px",
    rotateAmplitude = 15,
    scaleOnHover = 1.05,
    displayOverlayContent = false,
    overlayContent,
    glareColor = "#ffffff",
    glareOpacity = 0.3,
    glareAngle = -30,
    glareSize = 225,
    transitionDuration = 800,
    children
}: TiltedCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]);

    const springConfig = { damping: 20, stiffness: 300 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
    const springScale = useSpring(1, springConfig);

    const rgba = useMemo(() => {
        const hex = glareColor.replace('#', '');
        if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
        } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
        }
        return `rgba(255, 255, 255, ${glareOpacity})`;
    }, [glareColor, glareOpacity]);

    const glareVars = {
        '--gh-angle': `${glareAngle}deg`,
        '--gh-duration': `${transitionDuration}ms`,
        '--gh-size': `${glareSize}%`,
        '--gh-rgba': rgba,
    } as React.CSSProperties;

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseEnter() {
        springScale.set(scaleOnHover);
    }

    function handleMouseLeave() {
        springScale.set(1);
        x.set(0);
        y.set(0);
    }

    return (
        <div
            className="relative flex items-center justify-center"
            style={{
                width: containerWidth,
                height: containerHeight,
                perspective: '1000px',
            }}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    scale: springScale,
                    transformStyle: 'preserve-3d',
                    ...glareVars
                }}
                className="tilted-card-figure group bg-white shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
                <div className="tilted-card-inner">
                    {children ? (
                        <div style={{ width: imageWidth, height: imageHeight }}>
                            {children}
                        </div>
                    ) : (
                        imageSrc && (
                            <img
                                src={imageSrc}
                                alt={altText}
                                className="tilted-card-img transition-all duration-700"
                                style={{ width: imageWidth, height: imageHeight }}
                            />
                        )
                    )}

                    {(displayOverlayContent || captionText) && (
                        <div className="tilted-card-overlay transition-opacity duration-500">
                            {displayOverlayContent && overlayContent}
                            {captionText && !displayOverlayContent && (
                                <p className="tilted-card-caption">{captionText}</p>
                            )}
                        </div>
                    )}

                    {/* Glare Layer */}
                    <div className="tilted-card-glare" />
                </div>
            </motion.div>
        </div>
    );
}
