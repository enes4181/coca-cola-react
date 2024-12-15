import { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { apiService } from "../../api/login";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../utils/message";

function VerifyMail({ open, handleClose, apiResponseData }) {
  const [newVerificationCode, setNewVerificationCode] = useState(""); 
  const { errorMessage, successMessage, SnackbarComponent } = useSnackbar(); 

  const navigate = useNavigate();

  const handleVerifyMail = async () => {
    const { data } = apiResponseData;

    const verifyMailData = {
      email: data.email,
      verificationCode: newVerificationCode,
      tempUser: {
        email: data.email,
        name: data.name,
        lastname: data.lastname,
        password: data.password,
        verificationCode: data.verificationCode,
        verificationTime: data.verificationTime,
      },
    };
    try {
      console.log("verificationCode", newVerificationCode);

      console.log("verifyMailData", verifyMailData);
      const response = await apiService.verifyEmail(verifyMailData);
      console.log("response", response);
      if (response?.success === false) {
        throw new Error(data.message || "Something went wrong");
      }
      successMessage(
        "Email başarıyla doğrulandı!, Girişe Yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      errorMessage(error.message);
      console.error("Error:", error);
    }
  };

  const handleChange = (event) => {
    setNewVerificationCode(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          handleClose();
        },
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle>Mail Onayla</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Kayıt Başarılı, Lütfen mail adresinize gönderilen onay kodunu giriniz.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="code"
          name="code"
          label="Onay Kodu"
          placeholder="Onay Kodu"
          fullWidth
          value={newVerificationCode} // Değeri state'den al
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleVerifyMail}>
          Onayla
        </Button>
      </DialogActions>

      {SnackbarComponent}
    </Dialog>
  );
}

VerifyMail.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  apiResponseData: PropTypes.object.isRequired,
};

export default VerifyMail;
