package com.adonis.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.data.model.ForgotPasswordRequest
import com.adonis.app.data.model.LoginRequest
import com.adonis.app.data.model.RegisterRequest
import com.adonis.app.data.model.ResetPasswordRequest
import com.adonis.app.ui.components.AppInfoDialog
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    apiService: AdonisApiService,
    tokenManager: TokenManager,
    onLoginSuccess: () -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }

    // Toggle widoczności haseł ("oczko")
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    var resetNewPasswordVisible by remember { mutableStateOf(false) }
    var resetConfirmPasswordVisible by remember { mutableStateOf(false) }

    var errorMessage by remember { mutableStateOf<String?>(null) }
    var infoMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var showAppInfo by remember { mutableStateOf(false) }

    // Dialog resetu hasła
    var showForgotDialog by remember { mutableStateOf(false) }
    var resetEmailInput by remember { mutableStateOf("") }
    var resetTokenInput by remember { mutableStateOf("") }
    var resetNewPasswordInput by remember { mutableStateOf("") }
    var resetConfirmPasswordInput by remember { mutableStateOf("") }
    var resetStep by remember { mutableStateOf(1) }
    var resetStatusMessage by remember { mutableStateOf<String?>(null) }
    var isResetLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    fun doLogin(loginEmail: String, loginPass: String) {
        val cleanEmail = loginEmail.trim()
        val cleanPass = loginPass.trim()

        if (cleanEmail.isBlank()) {
            errorMessage = "Podaj adres e-mail lub login."
            return
        }
        if (cleanPass.isBlank()) {
            errorMessage = "Podaj hasło."
            return
        }

        isLoading = true
        errorMessage = null
        scope.launch {
            try {
                val res = apiService.login(LoginRequest(cleanEmail, cleanPass))
                tokenManager.saveToken(
                    token = res.token,
                    email = res.user.email,
                    role = res.user.role,
                    firstName = res.user.firstName,
                    lastName = res.user.lastName,
                    userId = res.user.id
                )
                onLoginSuccess()
            } catch (e: Exception) {
                val msg = e.localizedMessage ?: e.message ?: ""
                errorMessage = if (msg.contains("401") || msg.contains("Unauthorized") || msg.contains("400")) {
                    "Błąd logowania: nieprawidłowy e-mail lub hasło. Sprawdź wpisane dane za pomocą ikony podglądu hasła (oczka)."
                } else if (msg.contains("Failed to connect") || msg.contains("timeout") || msg.contains("Unable to resolve host") || msg.contains("Connection refused")) {
                    "Błąd połączenia z serwerem. Sprawdź połączenie internetowe."
                } else {
                    "Błąd logowania: $msg"
                }
            } finally {
                isLoading = false
            }
        }
    }

    fun doRegister() {
        val cleanEmail = email.trim()
        val cleanFirst = firstName.trim()
        val cleanLast = lastName.trim()
        val cleanPass = password.trim()
        val cleanConfirm = confirmPassword.trim()

        if (cleanFirst.isBlank()) {
            errorMessage = "Podaj swoje imię."
            return
        }
        if (cleanEmail.isBlank()) {
            errorMessage = "Podaj adres e-mail."
            return
        }
        if (cleanPass.length < 6) {
            errorMessage = "Hasło musi mieć co najmniej 6 znaków."
            return
        }
        if (cleanPass != cleanConfirm) {
            errorMessage = "Hasła nie są identyczne."
            return
        }

        isLoading = true
        errorMessage = null
        scope.launch {
            try {
                val res = apiService.register(
                    RegisterRequest(
                        email = cleanEmail,
                        password = cleanPass,
                        firstName = cleanFirst,
                        lastName = cleanLast,
                        role = "patient"
                    )
                )
                tokenManager.saveToken(
                    token = res.token,
                    email = res.user.email,
                    role = res.user.role,
                    firstName = res.user.firstName,
                    lastName = res.user.lastName,
                    userId = res.user.id
                )
                onLoginSuccess()
            } catch (e: Exception) {
                val msg = e.localizedMessage ?: e.message ?: ""
                errorMessage = if (msg.contains("istnieje") || msg.contains("400")) {
                    "Konto o podanym adresie e-mail już istnieje."
                } else if (msg.contains("Failed to connect") || msg.contains("timeout") || msg.contains("Unable to resolve host") || msg.contains("Connection refused")) {
                    "Błąd połączenia z serwerem. Sprawdź połączenie internetowe."
                } else {
                    "Błąd rejestracji: $msg"
                }
            } finally {
                isLoading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "ADONIS",
            fontSize = 34.sp,
            fontWeight = FontWeight.ExtraBold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "fit & eat",
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.secondary,
            letterSpacing = 2.sp,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        Text(
            text = if (isRegisterMode) "Rejestracja nowego pacjenta" else "Logowanie do konta pacjenta",
            fontSize = 15.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        errorMessage?.let {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.padding(12.dp)
                )
            }
        }

        infoMessage?.let {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.padding(12.dp)
                )
            }
        }

        if (isRegisterMode) {
            // Formularz rejestracji pacjenta
            OutlinedTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = { Text("Twoje imię *") },
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.Words
                ),
                modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp),
                singleLine = true
            )

            OutlinedTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = { Text("Nazwisko (opcjonalnie)") },
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.Words
                ),
                modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp),
                singleLine = true
            )

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Adres E-mail *") },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    capitalization = KeyboardCapitalization.None
                ),
                modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp),
                singleLine = true
            )

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Hasło (min. 6 znaków) *") },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    capitalization = KeyboardCapitalization.None
                ),
                trailingIcon = {
                    val icon = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    val desc = if (passwordVisible) "Ukryj hasło" else "Pokaż hasło"
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(icon, contentDescription = desc)
                    }
                },
                modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp),
                singleLine = true
            )

            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Powtórz hasło *") },
                visualTransformation = if (confirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    capitalization = KeyboardCapitalization.None
                ),
                trailingIcon = {
                    val icon = if (confirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    val desc = if (confirmPasswordVisible) "Ukryj hasło" else "Pokaż hasło"
                    IconButton(onClick = { confirmPasswordVisible = !confirmPasswordVisible }) {
                        Icon(icon, contentDescription = desc)
                    }
                },
                modifier = Modifier.fillMaxWidth().padding(bottom = 20.dp),
                singleLine = true
            )

            Button(
                onClick = { doRegister() },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !isLoading
            ) {
                Text(if (isLoading) "Rejestrowanie..." else "Zarejestruj konto pacjenta")
            }

            Spacer(modifier = Modifier.height(12.dp))

            TextButton(
                onClick = {
                    isRegisterMode = false
                    errorMessage = null
                    infoMessage = null
                }
            ) {
                Text("Masz już konto? Zaloguj się", fontSize = 13.sp)
            }
        } else {
            // Formularz logowania
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Adres E-mail lub login") },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    capitalization = KeyboardCapitalization.None
                ),
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                singleLine = true
            )

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Hasło") },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    capitalization = KeyboardCapitalization.None
                ),
                trailingIcon = {
                    val icon = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    val desc = if (passwordVisible) "Ukryj hasło" else "Pokaż hasło"
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(icon, contentDescription = desc)
                    }
                },
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                singleLine = true
            )

            TextButton(
                onClick = { showForgotDialog = true },
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Nie pamiętasz hasła? Resetuj hasło", fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.height(6.dp))

            Button(
                onClick = { doLogin(email, password) },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !isLoading
            ) {
                Text(if (isLoading) "Logowanie..." else "Zaloguj się")
            }

            Spacer(modifier = Modifier.height(14.dp))

            OutlinedButton(
                onClick = {
                    isRegisterMode = true
                    errorMessage = null
                    infoMessage = null
                },
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text("Nie masz konta? Zarejestruj się jako pacjent", fontSize = 13.sp)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            TextButton(onClick = { showAppInfo = true }) {
                Icon(Icons.Default.Info, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("O aplikacji", fontSize = 12.sp)
            }
        }

        Text(
            text = "ADONIS fit & eat • ver. 1.0",
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.45f),
            modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
        )

        // Dialog resetu hasła
        if (showForgotDialog) {
            AlertDialog(
                onDismissRequest = {
                    if (!isResetLoading) {
                        showForgotDialog = false
                        resetStatusMessage = null
                        resetStep = 1
                    }
                },
                title = { Text(if (resetStep == 1) "Reset hasła (Krok 1/2)" else "Ustaw nowe hasło (Krok 2/2)") },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        resetStatusMessage?.let { msg ->
                            Text(
                                text = msg,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        if (resetStep == 1) {
                            Text(
                                text = "Podaj adres e-mail przypisany do Twojego konta. Zostanie wygenerowany 6-cyfrowy kod weryfikacyjny.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            OutlinedTextField(
                                value = resetEmailInput,
                                onValueChange = { resetEmailInput = it },
                                label = { Text("Twój adres e-mail") },
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Email,
                                    capitalization = KeyboardCapitalization.None
                                ),
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        } else {
                            Text(
                                text = "Wprowadź kod weryfikacyjny otrzymany na e-mail oraz nowe hasło do konta.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            OutlinedTextField(
                                value = resetTokenInput,
                                onValueChange = { resetTokenInput = it },
                                label = { Text("6-cyfrowy kod weryfikacyjny") },
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Number,
                                    capitalization = KeyboardCapitalization.None
                                ),
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )

                            OutlinedTextField(
                                value = resetNewPasswordInput,
                                onValueChange = { resetNewPasswordInput = it },
                                label = { Text("Nowe hasło") },
                                visualTransformation = if (resetNewPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Password,
                                    capitalization = KeyboardCapitalization.None
                                ),
                                trailingIcon = {
                                    val icon = if (resetNewPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                                    IconButton(onClick = { resetNewPasswordVisible = !resetNewPasswordVisible }) {
                                        Icon(icon, contentDescription = null)
                                    }
                                },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )

                            OutlinedTextField(
                                value = resetConfirmPasswordInput,
                                onValueChange = { resetConfirmPasswordInput = it },
                                label = { Text("Powtórz nowe hasło") },
                                visualTransformation = if (resetConfirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions(
                                    keyboardType = KeyboardType.Password,
                                    capitalization = KeyboardCapitalization.None
                                ),
                                trailingIcon = {
                                    val icon = if (resetConfirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                                    IconButton(onClick = { resetConfirmPasswordVisible = !resetConfirmPasswordVisible }) {
                                        Icon(icon, contentDescription = null)
                                    }
                                },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                },
                confirmButton = {
                    if (resetStep == 1) {
                        Button(
                            onClick = {
                                if (resetEmailInput.isBlank()) {
                                    resetStatusMessage = "Podaj adres e-mail."
                                    return@Button
                                }
                                isResetLoading = true
                                scope.launch {
                                    try {
                                        val res = apiService.forgotPassword(ForgotPasswordRequest(email = resetEmailInput.trim()))
                                        val code = res["debug_code"] as? String
                                        resetStatusMessage = if (!code.isNullOrBlank()) {
                                            "Kod resetujący wygenerowany: $code (został przesłany na email)"
                                        } else {
                                            (res["message"] as? String) ?: "Kod został wysłany na podany e-mail."
                                        }
                                        resetStep = 2
                                    } catch (e: Exception) {
                                        resetStatusMessage = "Błąd: ${e.message}"
                                    } finally {
                                        isResetLoading = false
                                    }
                                }
                            },
                            enabled = !isResetLoading && resetEmailInput.isNotBlank()
                        ) {
                            Text(if (isResetLoading) "Wysyłanie..." else "Dalej →")
                        }
                    } else {
                        Button(
                            onClick = {
                                val cleanP1 = resetNewPasswordInput.trim()
                                val cleanP2 = resetConfirmPasswordInput.trim()
                                if (cleanP1 != cleanP2) {
                                    resetStatusMessage = "Hasła nie są identyczne."
                                    return@Button
                                }
                                if (cleanP1.length < 6) {
                                    resetStatusMessage = "Hasło musi mieć co najmniej 6 znaków."
                                    return@Button
                                }
                                isResetLoading = true
                                scope.launch {
                                    try {
                                        val res = apiService.resetPassword(
                                            ResetPasswordRequest(
                                                email = resetEmailInput.trim(),
                                                code = resetTokenInput.trim(),
                                                newPassword = cleanP1
                                            )
                                        )
                                        infoMessage = (res["message"] as? String) ?: "Hasło zostało pomyślnie zmienione! Możesz się zalogować."
                                        password = cleanP1
                                        email = resetEmailInput.trim()
                                        showForgotDialog = false
                                        resetStep = 1
                                    } catch (e: Exception) {
                                        resetStatusMessage = "Błąd: ${e.message}"
                                    } finally {
                                        isResetLoading = false
                                    }
                                }
                            },
                            enabled = !isResetLoading && resetTokenInput.isNotBlank() && resetNewPasswordInput.isNotBlank()
                        ) {
                            Text(if (isResetLoading) "Zapisywanie..." else "Zresetuj hasło")
                        }
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = {
                            showForgotDialog = false
                            resetStep = 1
                            resetStatusMessage = null
                        },
                        enabled = !isResetLoading
                    ) {
                        Text("Anuluj")
                    }
                }
            )
        }

        if (showAppInfo) {
            AppInfoDialog(onDismissRequest = { showAppInfo = false })
        }
    }
}
