import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { C } from '../../src/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi');
      return;
    }
    setIsLoading(true);
    try {
      await login({ username: username.trim(), password });
      if (Platform.OS === 'web') {
        window.location.replace('/');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.data?.message || 'Username atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brandRow}>
          <Text style={styles.brandMarket}>Market</Text>
          <Text style={styles.brandKita}>Kita</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Masuk ke Akun</Text>
          <Text style={styles.subtext}>Selamat datang kembali</Text>

          {/* Error */}
          {error ? (
            <View style={styles.alertError}>
              <Ionicons name="alert-circle-outline" size={14} color={C.red} />
              <Text style={styles.alertErrorText}>{error}</Text>
            </View>
          ) : null}

          {/* Username */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor={C.text2 + '99'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="Masukkan password"
                placeholderTextColor={C.text2 + '99'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={C.text2}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={C.bg} />
            ) : (
              <Text style={styles.submitBtnText}>Masuk →</Text>
            )}
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={styles.hint}>
            <Ionicons name="information-circle-outline" size={14} color={C.text2} />
            <Text style={styles.hintText}>
              Demo: <Text style={styles.hintAccent}>emilys</Text> / <Text style={styles.hintAccent}>emilyspass</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },

  brandRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  brandMarket: { fontSize: 28, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  brandKita: { fontSize: 28, fontWeight: '800', color: C.accent, letterSpacing: -0.5 },

  card: {
    backgroundColor: C.bg2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 28,
  },
  heading: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 4 },
  subtext: { fontSize: 14, color: C.text2, marginBottom: 24 },

  alertError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(232,69,69,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(232,69,69,0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertErrorText: { fontSize: 13, color: C.red, flex: 1 },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: C.text2, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: C.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  eyeBtn: { padding: 4 },

  submitBtn: {
    backgroundColor: C.accent,
    borderRadius: C.radius,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: C.bg, fontSize: 15, fontWeight: '700' },

  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    padding: 10,
    backgroundColor: C.bg3,
    borderRadius: 8,
  },
  hintText: { fontSize: 12, color: C.text2, flex: 1 },
  hintAccent: { color: C.accent, fontWeight: '600' },
});
