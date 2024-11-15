import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Group, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useContext } from 'react';
import UserDetailContext from '../../context/UserDetailContext.js';
import useProperties from '../../hooks/useProperties.jsx';
import { useMutation } from 'react-query';
import { createResidency } from '../../utils/api';
import { toast } from 'react-toastify';

const Facilities = ({
    prevStep,
    propertyDetails,
    setPropertyDetails,
    setOpened,
    setActiveStep,
}) => {
    if (typeof setPropertyDetails !== 'function') {
        console.error('setPropertyDetails must be a function');
        return null; // Safely return null to avoid rendering issues
    }

    const facilities = propertyDetails?.facilities || { bedrooms: 0, parkings: 0, bathrooms: 0 };

    const form = useForm({
        initialValues: {
            bedrooms: facilities.bedrooms,
            parkings: facilities.parkings,
            bathrooms: facilities.bathrooms,
        },
        validate: {
            bedrooms: (value) => (value < 1 ? "Must have at least one room" : null),
            bathrooms: (value) => (value < 1 ? "Must have at least one bathroom" : null),
        },
    });

    const { bedrooms, parkings, bathrooms } = form.values;

    const handleSubmit = () => {
        const hasErrors = form.validate().hasErrors;
        if (!hasErrors) {
            setPropertyDetails((prev) => ({
                ...prev,
                facilities: { bedrooms, parkings, bathrooms },
            }));
            mutate();
        }
    };

    // Upload Logic here
    const { user } = useAuth0();
    const {
        userDetails: { token },
    } = useContext(UserDetailContext);
    const { refetch: refetchProperties } = useProperties();

    const { mutate, isLoading } = useMutation({
        mutationFn: () =>
            createResidency(
                { ...propertyDetails, facilities: { bedrooms, parkings, bathrooms } },
                token
            ),
        onError: ({ response }) =>
            toast.error(response?.data?.message || "An error occurred", {
                position: "bottom-right",
            }),
        onSettled: () => {
            toast.success("Added Successfully", { position: "bottom-right" });
            setPropertyDetails({
                title: "",
                description: "",
                price: 0,
                country: "",
                city: "",
                address: "",
                image: null,
                facilities: {
                    bedrooms: 0,
                    parkings: 0,
                    bathrooms: 0,
                },
                userEmail: user?.email,
            });
            setOpened(false);
            setActiveStep(0);
            refetchProperties();
        },
    });

    return (
        <Box maw="30%" mx="auto" my="sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <NumberInput
                    withAsterisk
                    label="No of Bedrooms"
                    min={0}
                    {...form.getInputProps("bedrooms")}
                />
                <NumberInput
                    label="No of Parkings"
                    min={0}
                    {...form.getInputProps("parkings")}
                />
                <NumberInput
                    withAsterisk
                    label="No of Bathrooms"
                    min={0}
                    {...form.getInputProps("bathrooms")}
                />
                <Group position="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                    <Button type="submit" color="green" disabled={isLoading}>
                        {isLoading ? "Submitting" : "Add Property"}
                    </Button>
                </Group>
            </form>
        </Box>
    );
};

export default Facilities;
