import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Button, MenuItem, Checkbox, FormControlLabel, Snackbar, Alert, Stepper, Step, StepLabel, RadioGroup, Radio, CircularProgress } from "@mui/material";
import { applyToContest } from "../services/contestService";
import { getCurrentUserProfile } from "../services/userService";
import authService from "../services/authService";

const ContestApplication = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    chair: "",
    termsAccepted: false,
    useExistingShipping: "existing", // Default to using existing shipping info if available
  });
  
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setForm({
      ...form,
      [name]: name === "termsAccepted" ? checked : value,
    });
    
    // If user toggles between existing and new shipping info
    if (name === "useExistingShipping") {
      if (value === "existing" && userProfile?.profile?.shipping_address) {
        // Fill form with existing shipping info
        const shippingInfo = userProfile.profile.shipping_address;
        setForm(prevForm => ({
          ...prevForm,
          useExistingShipping: "existing",
          address: shippingInfo.line1 || '',
          city: shippingInfo.city || '',
          state: shippingInfo.state || '',
          postal_code: shippingInfo.postal || '',
          country: shippingInfo.country || ''
        }));
      } else if (value === "new") {
        // Clear shipping fields for new input
        setForm(prevForm => ({
          ...prevForm,
          useExistingShipping: "new",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          country: ""
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stepValid()) return;

    setSubmitting(true);
    try {
      // Prepare shipping address object based on user selection
      let shipping_address;
      if (form.useExistingShipping === "existing" && userProfile?.profile?.shipping_address) {
        // Use existing shipping info from profile
        const existingAddress = userProfile.profile.shipping_address;
        shipping_address = {
          line1: existingAddress.line1,
          line2: existingAddress.line2 || '',
          city: existingAddress.city,
          state: existingAddress.state || '',
          postal: existingAddress.postal,
          country: existingAddress.country
        };
      } else {
        // Use new shipping info from form
        shipping_address = {
          line1: form.address,
          line2: '',
          city: form.city,
          state: form.state || '',
          postal: form.postal_code,
          country: form.country
        };
      }
      
      await applyToContest(contestId, {
        full_name: form.full_name,
        email: form.email,
        shipping_address: shipping_address,
        product_id: parseInt(form.chair), // Convert chair value to integer product_id
        terms_accepted: form.termsAccepted,
      });

      setSnackbar({
        open: true,
        message: "Application submitted successfully!",
        severity: "success",
      });

      // Redirect to contest page after successful submission
      setTimeout(() => {
        navigate(`/contests/${contestId}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to submit application",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const stepValid = () => {
    if (step === 0) {
      // If using existing shipping info, only validate name and email
      if (form.useExistingShipping === "existing" && userProfile?.profile?.shipping_address) {
        return (
          form.full_name.trim() !== "" &&
          form.email.trim() !== ""
        );
      } else {
        // Otherwise validate all shipping fields
        return (
          form.full_name.trim() !== "" &&
          form.email.trim() !== "" &&
          form.address.trim() !== "" &&
          form.city.trim() !== "" &&
          form.country.trim() !== ""
        );
      }
    } else if (step === 1) {
      return form.chair !== "";
    } else if (step === 2) {
      return form.termsAccepted;
    }
    return false;
  };

  // Fetch user profile data including shipping info when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      // First check if user is authenticated
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        // User is not logged in, don't try to fetch profile
        setLoadingProfile(false);
        return;
      }
      
      setLoadingProfile(true);
      try {
        const profileData = await getCurrentUserProfile();
        setUserProfile(profileData);
        
        // Pre-fill form with user data if available
        if (profileData) {
          setForm(prevForm => ({
            ...prevForm,
            full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            email: profileData.email || ''
          }));
          
          // If shipping address exists, populate those fields too
          const shippingInfo = profileData.profile?.shipping_address;
          if (shippingInfo) {
            setForm(prevForm => ({
              ...prevForm,
              address: shippingInfo.line1 || '',
              city: shippingInfo.city || '',
              state: shippingInfo.state || '',
              postal_code: shippingInfo.postal || '',
              country: shippingInfo.country || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Don't show error to user - just proceed with empty form
        setProfileError(null);
        setUserProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", px: 2, py: 4, mt: { xs: 8, md: 10 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: '"Bebas Neue", sans-serif' }}>
        Contest Application
      </Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {['Your Info', 'Choose Chair', 'Terms'].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {step === 0 && (
          <>
            <TextField
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            
            {loadingProfile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 1 }}>Loading your shipping information...</Typography>
              </Box>
            ) : profileError ? (
              <Typography color="error" variant="body2" sx={{ my: 1 }}>{profileError}</Typography>
            ) : userProfile?.profile?.shipping_address ? (
              <>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Shipping Information</Typography>
                
                <RadioGroup
                  name="useExistingShipping"
                  value={form.useExistingShipping}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value="existing" 
                    control={<Radio />} 
                    label="Use my existing shipping address" 
                  />
                  <FormControlLabel 
                    value="new" 
                    control={<Radio />} 
                    label="Enter a new shipping address" 
                  />
                </RadioGroup>
                
                {form.useExistingShipping === "existing" ? (
                  <Box sx={{ 
                    mt: 2, 
                    p: 2, 
                    border: '1px solid #333', 
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Your Saved Address:</Typography>
                    <Typography variant="body2">
                      {userProfile.profile.shipping_address.line1}
                      {userProfile.profile.shipping_address.line2 && (
                        <>, {userProfile.profile.shipping_address.line2}</>
                      )}
                    </Typography>
                    <Typography variant="body2">
                      {userProfile.profile.shipping_address.city}, 
                      {userProfile.profile.shipping_address.state && `${userProfile.profile.shipping_address.state}, `}
                      {userProfile.profile.shipping_address.postal}
                    </Typography>
                    <Typography variant="body2">{userProfile.profile.shipping_address.country}</Typography>
                  </Box>
                ) : (
                  <>
                    <TextField
                      label="Street Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="State/Province"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        fullWidth
                      />
                      <TextField
                        label="Postal Code"
                        name="postal_code"
                        value={form.postal_code}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Box>
                    <TextField
                      label="Country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </>
                )}
              </>
            ) : (
              // No existing shipping info, show regular form fields
              <>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Shipping Information</Typography>
                <TextField
                  label="Street Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="State/Province"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Postal Code"
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    fullWidth
                  />
                </Box>
                <TextField
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <TextField
              label="Select Chair"
              name="chair"
              select
              value={form.chair}
              onChange={handleChange}
              required
              fullWidth
            >
              {[
                { value: "2", label: "X7" },
                { value: "1", label: "E3" },
                { value: "3", label: "P2" },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {step === 2 && (
          <FormControlLabel
            control={<Checkbox name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />}
            label="I accept the contest terms and conditions"
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button disabled={step === 0} onClick={handleBack}>Back</Button>
          {step < 2 ? (
            <Button variant="contained" disabled={!stepValid()} onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={submitting || !stepValid()}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContestApplication;
