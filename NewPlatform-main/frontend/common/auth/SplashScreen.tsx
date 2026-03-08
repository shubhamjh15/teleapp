/**
 * SplashScreen — Animated splash/welcome screen after OTP verification.
 *
 * Design-forward, sleek loading experience with:
 * - Animated logo reveal with scaling
 * - Pulsing ring animations
 * - Floating particles
 * - Smooth progress bar
 * - Auto-transition after animation completes
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LoginResponse } from './authService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  loginData: LoginResponse;
  onContinue?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  loginData,
  onContinue,
}) => {
  // ─── Animations ───────────────────────────────────────────────────────────
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(20)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;

  // Ring animations
  const ring1Scale = useRef(new Animated.Value(0.8)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.6)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const ring3Scale = useRef(new Animated.Value(0.5)).current;
  const ring3Opacity = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle4Y = useRef(new Animated.Value(0)).current;
  const particlesOpacity = useRef(new Animated.Value(0)).current;

  // Glow pulse
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Phase 1: Logo reveal
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2: Rings expand outward
    setTimeout(() => {
      const ringAnimation = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(scale, {
                toValue: 2.5,
                duration: 2500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(opacity, {
                  toValue: 0.4,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 2100,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.parallel([
              Animated.timing(scale, {
                toValue: 0.8,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      };

      ringAnimation(ring1Scale, ring1Opacity, 0);
      ringAnimation(ring2Scale, ring2Opacity, 800);
      ringAnimation(ring3Scale, ring3Opacity, 1600);
    }, 400);

    // Phase 3: Tagline slides in
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Phase 4: Floating particles
    setTimeout(() => {
      Animated.timing(particlesOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      const floatParticle = (anim: Animated.Value, distance: number, duration: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -distance,
              duration,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: distance,
              duration,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      floatParticle(particle1Y, 15, 3000);
      floatParticle(particle2Y, 10, 2500);
      floatParticle(particle3Y, 20, 3500);
      floatParticle(particle4Y, 12, 2800);
    }, 800);

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.2,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Phase 5: Progress bar
    setTimeout(() => {
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 2500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        // Auto-navigate after progress completes
        if (onContinue) {
          setTimeout(onContinue, 300);
        }
      });
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07051A" />

      {/* Deep background */}
      <View style={styles.bgDeep} />

      {/* Ambient glow */}
      <Animated.View
        style={[
          styles.ambientGlow,
          { opacity: glowOpacity },
        ]}
      />

      {/* Floating particles */}
      <Animated.View style={[styles.particlesLayer, { opacity: particlesOpacity }]}>
        <Animated.View
          style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }] }]}
        />
        <Animated.View
          style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }] }]}
        />
        <Animated.View
          style={[styles.particle, styles.particle3, { transform: [{ translateY: particle3Y }] }]}
        />
        <Animated.View
          style={[styles.particle, styles.particle4, { transform: [{ translateY: particle4Y }] }]}
        />
        <Animated.View
          style={[styles.particle, styles.particle5, { transform: [{ translateY: particle2Y }] }]}
        />
        <Animated.View
          style={[styles.particle, styles.particle6, { transform: [{ translateY: particle3Y }] }]}
        />
      </Animated.View>

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Pulsing rings */}
        <View style={styles.ringsContainer}>
          <Animated.View
            style={[
              styles.ring,
              { transform: [{ scale: ring1Scale }], opacity: ring1Opacity },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              { transform: [{ scale: ring2Scale }], opacity: ring2Opacity },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              { transform: [{ scale: ring3Scale }], opacity: ring3Opacity },
            ]}
          />

          {/* Logo circle */}
          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            <Text style={styles.logoIcon}>🦴</Text>
          </Animated.View>
        </View>

        {/* Brand name */}
        <Animated.View style={{ opacity: logoOpacity }}>
          <Text style={styles.brandName}>HealthScan360</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: taglineOpacity,
            transform: [{ translateY: taglineSlide }],
          }}
        >
          <Text style={styles.tagline}>Healthcare at Your Fingertips</Text>
        </Animated.View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Progress bar */}
        <Animated.View style={[styles.progressTrack, { opacity: progressOpacity }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </Animated.View>

        <Animated.Text style={[styles.loadingText, { opacity: progressOpacity }]}>
          Setting up your experience...
        </Animated.Text>

        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07051A',
    overflow: 'hidden',
  },

  // ── Background ────────────────────────────────────────────────────────────
  bgDeep: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07051A',
  },
  ambientGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.2,
    left: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
  },

  // ── Particles ─────────────────────────────────────────────────────────────
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
  },
  particle1: {
    top: '18%',
    left: '12%',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(179, 136, 255, 0.5)',
  },
  particle2: {
    top: '28%',
    right: '18%',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(124, 77, 255, 0.6)',
  },
  particle3: {
    top: '65%',
    left: '8%',
    width: 5,
    height: 5,
    backgroundColor: 'rgba(0, 176, 255, 0.35)',
  },
  particle4: {
    top: '55%',
    right: '12%',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(179, 136, 255, 0.4)',
  },
  particle5: {
    top: '40%',
    left: '25%',
    width: 2,
    height: 2,
    backgroundColor: 'rgba(124, 77, 255, 0.45)',
  },
  particle6: {
    top: '72%',
    right: '28%',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(0, 176, 255, 0.3)',
  },

  // ── Center ────────────────────────────────────────────────────────────────
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Rings ─────────────────────────────────────────────────────────────────
  ringsContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  logoIcon: {
    fontSize: 36,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  brandName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '400',
    letterSpacing: 0.5,
  },

  // ── Bottom ────────────────────────────────────────────────────────────────
  bottomSection: {
    paddingHorizontal: 48,
    paddingBottom: 50,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C4DFF',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.35)',
    fontWeight: '500',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.15)',
    fontWeight: '500',
  },
});

export default SplashScreen;
