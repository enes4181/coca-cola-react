import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import useSnackbar from "../utils/message";
import { apiService } from "../../api/login";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ForgetPassword({ open, handleClose, screenValue, setScreenValue }) {
  const [resetMailValue, setMailValue] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [temporaryToken, setTemporaryToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { errorMessage, successMessage, SnackbarComponent } = useSnackbar();

  const fullResetValue = useCallback(()=>{
    setResetCode("");
    setMailValue("");
    setNewPassword("");
    setTemporaryToken("");
    setShowPassword(false);
    handleClose()
  }, [setResetCode, setMailValue, setNewPassword, setTemporaryToken, setShowPassword, handleClose]);

  const forgetPasswordFn = useCallback(async () => {
    try {
      const response = await apiService.forgetPassword(resetMailValue);
      if (response?.success === false) {
        throw new Error(response.message || "Something went wrong");
      }
      successMessage(
        response?.message ||
          "Şifre sıfırlama kodu e-posta adresinize gönderildi."
      );
      setScreenValue("resetCodeCheck");
    } catch (error) {
      setScreenValue("email");
      errorMessage(error?.message);
    }
  }, [resetMailValue, successMessage, errorMessage, setScreenValue]);

  const resetCodeCheckFn = useCallback(async () => {
    try {
      const requestResetMail = {
        email: resetMailValue,
        code: resetCode,
      };
      const response = await apiService.resetCodeCheck(requestResetMail);
      if (response?.success === false) {
        throw new Error(response.message || "Something went wrong");
      }
      setTemporaryToken(response?.data?.temporaryToken);

      successMessage(response?.message);
      setScreenValue("newPassword");
    } catch (error) {
      errorMessage(error?.message);
      setScreenValue("resetCodeCheck");
    }
  }, [resetCode, successMessage, errorMessage, setScreenValue, resetMailValue]);

  const newPasswordFn = useCallback(async () => {
    try {
      const requestNewPassword = {
        temporaryToken,
        password: newPassword,
      };
      const response = await apiService.resetPassword(requestNewPassword);
      if (response?.success === false) {
        throw new Error(response.message || "Something went wrong");
      }
      successMessage(response?.message);
      successMessage("Girişe yönlendiriliyorsunuz...");
      setTimeout(() => {
        fullResetValue()
      }, 2000);
    } catch (error) {
      errorMessage(error?.message);
      setScreenValue("newPassword");
    }
  }, [
    newPassword,
    successMessage,
    errorMessage,
    setScreenValue,
    temporaryToken,
    fullResetValue
  ]);

  const handleChangeMailChange = (event) => {
    setMailValue(event.target.value);
  };

  const handleChangeResetCodeChange = (event) => {
    setResetCode(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dialogTitleFn = useMemo(() => {
    if (screenValue === "resetCodeCheck") {
      return "Mail adresinizdeki sıfırlama kodunu girin";
    }
    if (screenValue === "email") {
      return "Hesabınızın e-posta adresini girin, size şifrenizi sıfırlamanız için bir kod gönderelim.";
    }
    if (screenValue === "newPassword") {
      return "Lütfen Oluşturmak İstediğiniz Yeni Şifrenizi Giriniz";
    }
  }, [screenValue]);

  const onClickFn = useCallback(() => {
    if (screenValue === "resetCodeCheck") {
      resetCodeCheckFn();
    }
    if (screenValue === "email") {
      forgetPasswordFn();
    }
    if (screenValue === "newPassword") {
      return newPasswordFn();
    }
  }, [resetCodeCheckFn, forgetPasswordFn, screenValue, newPasswordFn]);




  return (
    <Dialog
      open={open}
      onClose={fullResetValue}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
        },
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle>Şifre Sıfırlama</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>{dialogTitleFn} </DialogContentText>
        {screenValue === "resetCodeCheck" && (
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="code"
            name="code"
            label="Sıfırlama Kodu"
            placeholder="Sıfırlama Kodu"
            fullWidth
            value={resetCode}
            onChange={handleChangeResetCodeChange}
          />
        )}
        {screenValue === "email" && (
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="mail@cci.com.tr"
            type="email"
            fullWidth
            value={resetMailValue}
            onChange={handleChangeMailChange}
          />
        )}
        {screenValue === "newPassword" && (
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            name="password"
            placeholder="••••••"
            type={showPassword ? "text" : "password"} 
            id="password"
            fullWidth
            value={newPassword}
            onChange={handleNewPasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handlePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={fullResetValue}>İptal</Button>
        <Button variant="contained" onClick={onClickFn}>
          Onayla
        </Button>
      </DialogActions>
      {SnackbarComponent}
    </Dialog>
  );
}

ForgetPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  screenValue: PropTypes.string.isRequired,
  setScreenValue: PropTypes.func.isRequired,
};

export default ForgetPassword;
