import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(-50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia de animaciones
    const animationSequence = Animated.sequence([
      // Aparición del fondo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Escala del logo/icono principal
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Deslizamiento del título
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de gotas
    const dropAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dropAnim, {
          toValue: height,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(dropAnim, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Iniciar animaciones
    animationSequence.start();
    waveAnimation.start();
    dropAnimation.start();

    // Redirección después de 4 segundos
    const timer = setTimeout(() => {
      navigation.replace("Welcome"); // Cambia 'Welcome' por la pantalla a la que quieras navegar
    }, 4000);

    return () => {
      clearTimeout(timer);
      waveAnimation.stop();
      dropAnimation.stop();
    };
  }, [navigation]);

  const waveTranslateY = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Fondo gradiente animado */}
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        {/* Gotas animadas */}
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

        {/* Ondas de agua */}
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

        {/* Icono principal */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.icon}>
            <Text style={styles.iconText}>🌊</Text>
          </View>
        </Animated.View>

        {/* Título */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          FloodAlert QRO
        </Animated.Text>

        {/* Subtítulo */}
        <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
          Sistema de Alertas de Inundaciones
        </Animated.Text>

        {/* Indicador de carga */}
        <Animated.View
          style={[styles.loadingContainer, { opacity: textOpacity }]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["20%", "100%"],
                  }),
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
    backgroundColor: "#1e3a8a",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    position: "relative",
  },
  drop: {
    position: "absolute",
    width: 8,
    height: 20,
    backgroundColor: "#93c5fd",
    borderRadius: 10,
    opacity: 0.7,
  },
  drop1: {
    left: "20%",
    animationDelay: "0s",
  },
  drop2: {
    left: "60%",
    animationDelay: "0.5s",
  },
  drop3: {
    left: "80%",
    animationDelay: "1s",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#3b82f6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    opacity: 0.3,
  },
  wave1: {
    height: 120,
    opacity: 0.2,
  },
  wave2: {
    height: 80,
    opacity: 0.4,
    backgroundColor: "#60a5fa",
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e7ff",
    textAlign: "center",
    marginBottom: 50,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    left: 50,
    right: 50,
    alignItems: "center",
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  loadingText: {
    color: "#e0e7ff",
    fontSize: 14,
  },
});

export default SplashScreen;
