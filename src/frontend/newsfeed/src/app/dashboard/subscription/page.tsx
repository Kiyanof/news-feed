"use client";
import { whoIsMe } from "@/app/API/route/auth";
import { changeSubscription, subscribe } from "@/app/API/route/subscribe";
import Prompt from "@/app/components/forms/subscription/Prompt";
import SubscriptionForm from "@/app/components/forms/subscription/SubscriptionForm";
import { setUser } from "@/lib/redux/features/app/appSlice";
import {
  setPrompt,
  subscriptionEmail,
  subscriptionFrequency,
  subscriptionIsSamePassword,
  subscriptionPassword,
  subscriptionPrompt,
} from "@/lib/redux/features/subscription/subscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  ChangeCircle as ChangeCircleIcon,
  Check as CheckIcon,
  Subscriptions as SubscriptionsIcon,
} from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AlertPropsColorOverrides,
  Avatar,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const Page = () => {
  const params = {
    messageClipMaxChars: 20,
  };

  const [defaultEmail, setDefaultEmail] = useState<string | null>("");
  const [defaultFrequency, setDefaultFrequency] = useState<string | null>("");
  const [defaultPrompt, setDefaultPrompt] = useState<string | null>("");

  const [loading, setLoading] = useState<boolean | null>(false);
  const [error, setError] = useState<boolean | null>(false);
  const [message, setMessage] = useState<string | null>("");
  const [messageSeverity, setMessageSeverity] = useState<
    AlertColor | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const email = useAppSelector(subscriptionEmail);
  const frequency = useAppSelector(subscriptionFrequency);
  const prompt = useAppSelector(subscriptionPrompt);
  const password = useAppSelector(subscriptionPassword);
  const isSamePassword = useAppSelector(subscriptionIsSamePassword);

  const defaultProps = {
    avatar: <SubscriptionsIcon />,
    title: "Subscriptions",
    subheader: "Manage your subscriptions",
  };

  const clipMessage = (message: string) => {
    const maxChars = params.messageClipMaxChars;
    const clippedMessage =
      message.length > maxChars
        ? message.substring(0, maxChars) + "..."
        : message;
    return clippedMessage;
  };

  const handlePromptChange = (value: string) => {
    dispatch(setPrompt(value));
  };

  const handleSubmit = async () => {
    setError(false);
    setLoading(true);

    const body = {
      email,
      frequency,
      prompt,
      password,
    };

    const response = await subscribe(body);

    setTimeout(() => {
      if (!response) {
        setError(true);
        setMessageSeverity("error");
        setMessage("Check your connection...");
        setLoading(false);
      } else {
        const hasError = response.error && response.error.length > 0;
        setError(hasError);
        setMessageSeverity(hasError ? "error" : "success");
        setMessage(response.message);
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    try {
      const getUser = async () => {
        const response = await whoIsMe();
        const userData = response ? response.data : null;

        if (userData) {
          setDefaultEmail(userData.email);
          setDefaultFrequency(userData.frequency);
          setDefaultPrompt(userData.prompt);
          dispatch(setUser(userData.email));
        }
      };

      getUser();
    } catch (error) {
      console.log({ error });
    }

    return () => {
      setDefaultEmail(null);
      setDefaultFrequency(null);
      setDefaultPrompt(null);
    }
  }, []);

  const handleSubscriptionChange = async () => {
    setError(false);
    setLoading(true);

    const body = {
      email,
      frequency,
      prompt,
      password,
    };

    const response = await changeSubscription(body);

    setTimeout(() => {
      if (!response) {
        setError(true);
        setMessageSeverity("error");
        setMessage("Check your connection...");
        setLoading(false);
      } else {
        const hasError = response.error && response.error.length > 0;
        setError(hasError);
        setMessageSeverity(hasError ? "error" : "success");
        setMessage(response.message);
        setLoading(false);
      }
    }, 2000);
  }

  return (
    <Container>
      <Paper elevation={0}>
        <CardHeader
          className="tw-bg-slate-50"
          avatar={
            <Avatar className="tw-bg-teal-700">{defaultProps.avatar}</Avatar>
          }
          title={
            <Typography variant="h5" component={"h2"}>
              {defaultProps.title}
            </Typography>
          }
          subheader={
            <Typography variant="caption">{defaultProps.subheader}</Typography>
          }
        />
        <Divider
          className={`${
            error ? "!tw-border-2 !tw-border-rose-500" : "tw-border-indigo-100"
          }`}
        />
        {loading && (
          <LinearProgress color="success" className="tw-bg-cyan-50" />
        )}
        <CardContent>
          <Container className="tw-my-5">
            <Stack direction={{ sm: "column", md: "row" }} gap={3}>
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                className="tw-border-teal-600 tw-border-2"
              />
              <Container>
                <SubscriptionForm
                  defaultEmail={defaultEmail}
                  defaultFrequency={defaultFrequency}
                />
              </Container>
              <Divider flexItem orientation="vertical" variant="middle" />
              <Container>
                <Prompt value={defaultPrompt} onchange={handlePromptChange} />
              </Container>
            </Stack>
          </Container>
        </CardContent>
        <CardActions>
          <Stack
            className="tw-w-full"
            direction={{ sm: "row" }}
            justifyContent={"space-between"}
            alignItems={"end"}
          >
            {message ? (
              <Alert
                severity={messageSeverity}
                variant="standard"
                className="tw-min-w-[300px] tw-max-w-[500px]"
              >
                {clipMessage(message)}
              </Alert>
            ) : (
              <div></div>
            )}
            <Stack direction={{ xs: "row" }} gap={2}>
              {defaultEmail ? (
                <Tooltip title="Submit Changes">
                  <IconButton onClick={handleSubscriptionChange} color="warning">
                    <ChangeCircleIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Subscribe">
                  <IconButton onClick={handleSubmit} color="success">
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Divider flexItem orientation="vertical" variant="middle" />
            </Stack>
          </Stack>
        </CardActions>
      </Paper>
    </Container>
  );
};

export default Page;
