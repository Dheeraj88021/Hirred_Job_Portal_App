import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useFetch from "@/hook/Usefetch"
import { applyToJob } from "@/api/apiApplications"
import { BarLoader } from "react-spinners"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = z.object({
    experience: z
        .number()
        .min(0, { message: "Experience must be at least 0" })
        .int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
        message: "Education is required",
    }),
    resume: z
        .any()
        .refine(
            (file) =>
                file[0] &&
                (file[0].type === "application/pdf" ||
                    file[0].type === "application/msword"),
            { message: "Only PDF or Word documents are allowed" }
        ),
});


const AppplyJobDrawer = ({ job, user, fetchJob, applied = false }) => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyToJob);

    const onSubmit = (data) => {
        fnApply({
            ...data,
            job_id: job.id,
            condidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0],
        }).then(() => {
            fetchJob();
            reset();
        });
        toast("Job has been Applied Successfully!");

    };

    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger asChild>
                <Button
                    size="lg"
                    variant={job?.isOpen && !applied ? "blue" : "destructive"}
                    disabled={!job?.isOpen || applied}
                >
                    {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job?.title} at {job?.company?.name} Company</DrawerTitle>
                    <DrawerDescription>Please fill the form Below.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
                    <Input type="number"
                        placeholder="Year of Experience"
                        className="flex-1"
                        {...register("experience", {
                            valueAsNumber: true,
                        })}
                    />
                    {errors.experience && (<p className="text-red-500">{errors.experience.message}</p>)}

                    <Input type="text"
                        placeholder="Skills (Comma Seprated)"
                        className="flex-1"
                        {...register("skills")}

                    />
                    {errors.skills && (<p className="text-red-500">{errors.skills.message}</p>)}
                    <Controller name="education"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                {...field}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Intermediate" id="Intermediate" />
                                    <Label htmlFor="Intermediate">Intermediate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Graduate" id="Graduate" />
                                    <Label htmlFor="Graduate">Graduate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Post Graduate" id="Post-Graduate" />
                                    <Label htmlFor="Post-Graduate">Post Graduate</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />

                    {errors.education && (<p className="text-red-500">{errors.education.message}</p>)}

                    <Input type="file" {...register("resume")} accept=".pdf, .doc, .docx" className="flex-1 file:text-gray-500" />
                    {errors.resume && (<p className="text-red-500">{errors.resume.message}</p>)}

                    {errorApply?.message && (<p className="text-red-500">{errorApply?.message}</p>)}
                    {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

                    <Button type="Submit" variant="blue" size="lg" >Apply</Button>
                    <ToastContainer />

                </form>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >

    )
}

export default AppplyJobDrawer