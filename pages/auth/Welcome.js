import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de flotación continua
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, []);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E0F2FE" barStyle="dark-content" />
      
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Elementos decorativos de fondo */}
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

      {/* Gotas decorativas */}
      <Animated.View
        style={[
          styles.drop,
          styles.drop1,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.drop,
          styles.drop2,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />

      {/* Contenido principal */}
      <Animated.View 
        style={[
          styles.innerCard,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Logo con animación */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: floatTranslateY }
              ]
            }
          ]}
        >
          <View style={styles.logoShadow}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Título */}
        <Animated.Text 
          style={[
            styles.title,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          Bienvenido a{"\n"}InundaQRO
        </Animated.Text>

        {/* Descripción */}
        <Animated.Text 
          style={[
            styles.description,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          Sistema inteligente de alertas de inundaciones para Querétaro. 
          Mantente informado y protegido con notificaciones en tiempo real.
        </Animated.Text>

        {/* Botones con animación */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0EA5E9', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.loginText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>Registrarse</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Ondas decorativas en la parte inferior */}
      <Animated.View
        style={[
          styles.wave,
          styles.wave1,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          styles.wave2,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
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
    width: 150,
    height: 150,
    top: "10%",
    left: -30,
  },
  circle2: {
    width: 100,
    height: 100,
    top: "15%",
    right: -20,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: "25%",
    left: "15%",
  },
  drop: {
    position: "absolute",
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  drop1: {
    width: 8,
    height: 15,
    top: "20%",
    left: width * 0.3,
    borderRadius: 8,
  },
  drop2: {
    width: 10,
    height: 18,
    top: "25%",
    right: width * 0.3,
    borderRadius: 9,
  },
  wave: {
    position: "absolute",
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  wave1: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -50,
  },
  wave2: {
    width: 150,
    height: 150,
    bottom: -75,
    right: -40,
  },
  innerCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginHorizontal: 20,
    marginVertical: 60,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
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
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0369A1",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 36,
    textShadowColor: "rgba(3, 105, 161, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: "#0284C7",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
    fontWeight: "400",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  registerButton: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0EA5E9",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerText: {
    color: "#0EA5E9",
    fontSize: 18,
    fontWeight: "600",
  },
});