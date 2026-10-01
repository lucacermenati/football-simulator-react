import { useForm } from "react-hook-form";
import { Form, TextArea, TextInput } from "../../../../components/form";
import Modal from "../../../../components/modal/modal";
import type { Team, UpdateTeamRequest } from "../../../../types/api";
import { fieldErrorToMessage } from "../../../../utils/fieldErrorToMessage";
import style from './team-edit.module.scss';

export default function TeamEdit({team, onCancel}: {team: Team, onCancel: () => void}) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdateTeamRequest>({
        defaultValues: {
            name: team.name,
            history: team.history || '',
            first_color: team.first_color || '',
            second_color: team.second_color || '',
            year_of_foundation: team.year_of_foundation || undefined,
            stadium: team.stadium || '',
        },
    });

    return (
        <Modal
            title={`Edit Team: ${team.name}`}
            description="Fill in all mandatory fields to edit the team."
            onCancel={onCancel}
            onSubmit={handleSubmit((data) => {
                console.log("SUBMIT", data);
            })}
            isSubmitting={isSubmitting}
        >
            <Form>
                <TextInput
                    id='name'
                    label='Name'
                    placeholder='Competition'
                    error={fieldErrorToMessage(errors.name)}
                    {...register('name')}
                />
                <TextArea
                    id='history'
                    label='History'
                    placeholder='History'
                    error={fieldErrorToMessage(errors.history)}
                    {...register('history')}
                />
                <div className={style.colorInputBox}>
                    <TextInput
                        type='color'
                        id='first_color'
                        label='First Color'
                        placeholder='First Color'
                        error={fieldErrorToMessage(errors.first_color)}
                        {...register('first_color')}
                    />
                    <TextInput
                        type='color'
                        id='second_color'
                        label='Second Color'
                        placeholder='Second Color'
                        error={fieldErrorToMessage(errors.second_color)}
                        {...register('second_color')}
                    />
                </div>
                <TextInput
                    type="number"
                    id='year_of_foundation'
                    label='Year of Foundation'
                    placeholder='Year of Foundation'
                    error={fieldErrorToMessage(errors.year_of_foundation)}
                    {...register('year_of_foundation')}
                />
                <TextInput
                    id='stadium'
                    label='Stadium'
                    placeholder='Stadium'
                    error={fieldErrorToMessage(errors.stadium)}
                    {...register('stadium')}
                />
            </Form>
        </Modal>
    );
}
