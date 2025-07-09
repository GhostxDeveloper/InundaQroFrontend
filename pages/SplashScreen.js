import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(-50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia de animaciones principal
    const animationSequence = Animated.sequence([
      // Aparición del fondo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Escala del logo con bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      // Deslizamiento del título con easing
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Aparición del texto
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    // Animación de ondas continua
    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de gotas mejorada
    const dropAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dropAnim, {
          toValue: height + 100,
          duration: 2000,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dropAnim, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotación suave del logo
    const logoRotationAnimation = Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulso del logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Efecto shimmer para el título
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Animación de flotación
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de la barra de progreso
    const progressAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // Necesario para animar width
        }),
        Animated.timing(progressAnim, {
          toValue: 0.2,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    // Iniciar animaciones
    animationSequence.start();
    waveAnimation.start();
    dropAnimation.start();
    logoRotationAnimation.start();
    pulseAnimation.start();
    shimmerAnimation.start();
    floatAnimation.start();
    progressAnimation.start();

    // Redirección después de 4 segundos
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 4000);

    return () => {
      clearTimeout(timer);
      waveAnimation.stop();
      dropAnimation.stop();
      logoRotationAnimation.stop();
      pulseAnimation.stop();
      shimmerAnimation.stop();
      floatAnimation.stop();
      progressAnimation.stop();
    };
  }, [navigation]);

  // Interpolaciones para las animaciones
  const waveTranslateY = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const logoRotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['20%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E0F2FE" barStyle="dark-content" />

      {/* Fondo gradiente animado */}
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        {/* Círculos flotantes de fondo */}
        <Animated.View
          style={[
            styles.backgroundCircle,
            styles.circle1,
            { transform: [{ translateY: floatTranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.backgroundCircle,
            styles.circle2,
            { transform: [{ translateY: floatTranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.backgroundCircle,
            styles.circle3,
            { transform: [{ translateY: floatTranslateY }] },
          ]}
        />

        {/* Gotas animadas mejoradas */}
        <Animated.View
          style={[
            styles.drop,
            styles.drop1,
            { transform: [{ translateY: dropAnim }] },
          ]}
        />
        <Animated.View
          style={[
            styles.drop,
            styles.drop2,
            { transform: [{ translateY: dropAnim }] },
          ]}
        />
        <Animated.View
          style={[
            styles.drop,
            styles.drop3,
            { transform: [{ translateY: dropAnim }] },
          ]}
        />

        {/* Ondas de agua mejoradas */}
        <Animated.View
          style={[
            styles.wave,
            styles.wave1,
            {
              transform: [{ translateY: waveTranslateY }, { scale: waveScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wave,
            styles.wave2,
            {
              transform: [{ translateY: waveTranslateY }, { scale: waveScale }],
            },
          ]}
        />

        {/* Contenedor del logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
                { rotate: logoRotate },
                { translateY: floatTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.logoShadow}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Título con efecto shimmer */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>FloodAlert QRO</Text>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          />
        </Animated.View>

        {/* Subtítulo */}
        <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
          Sistema de Alertas de Inundaciones
        </Animated.Text>

        {/* Indicador de carga mejorado */}
        <Animated.View
          style={[styles.loadingContainer, { opacity: textOpacity }]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Cargando...</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundCircle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1000,
  },
  circle1: {
    width: 200,
    height: 200,
    top: "10%",
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: "20%",
    right: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: "30%",
    left: "20%",
  },
  drop: {
    position: "absolute",
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  drop1: {
    width: 12,
    height: 20,
    left: width * 0.2,
    borderRadius: 10,
  },
  drop2: {
    width: 8,
    height: 15,
    left: width * 0.8,
    borderRadius: 8,
  },
  drop3: {
    width: 10,
    height: 18,
    left: width * 0.6,
    borderRadius: 9,
  },
  wave: {
    position: "absolute",
    backgroundColor: "rgba(14, 165, 233, 0.15)",
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: "rgba(14, 165, 233, 0.3)",
  },
  wave1: {
    width: 300,
    height: 300,
    bottom: -150,
    left: -100,
  },
  wave2: {
    width: 250,
    height: 250,
    bottom: -125,
    right: -80,
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoShadow: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    position: "relative",
    overflow: "hidden",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0369A1",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "rgba(3, 105, 161, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: 100,
    height: "100%",
    transform: [{ skewX: "-20deg" }],
  },
  subtitle: {
    fontSize: 16,
    color: "#0284C7",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 80,
    width: "100%",
  },
  loadingBar: {
    width: width * 0.6,
    height: 8,
    backgroundColor: "rgba(186, 230, 253, 0.5)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#0EA5E9",
    borderRadius: 4,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#0369A1",
    fontWeight: "500",
  },
});

export default SplashScreen;