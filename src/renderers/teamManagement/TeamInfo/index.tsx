import React, { FC, useEffect, useRef, useState, Suspense } from 'react'
import Button from '@components/Button'
import Input, { TextArea } from '@components/Input'
import { TeamSchema } from '@data/Team'
import { InfoForm, InfoSection, SubmitSection, TeamInfoLayout } from './styled'
import Icon from '@components/Icon';

import editIcon from '../../../assets/icons/edit.svg';

type Props = {
    teamInfo: TeamSchema;
    handleConfirm: (data: TeamSchema) => void;
    changeMode: (mode: 'edit' | 'view' | 'add') => void;
    mode: 'edit' | 'view' | 'add'
}

const intialTeamInfo: TeamSchema = {
    id: '',
    teamName: '',
    info: {
        owner: '',
        phone: '',
        address: '',
    },
    members: [],
}

const TeamInfo: FC<Props> = ({ teamInfo, handleConfirm, changeMode, mode }) => {
    const [tempTeam, setTempTeam] = useState<TeamSchema>(intialTeamInfo);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (teamInfo) {
            setTempTeam(teamInfo);
        }
    }, [teamInfo]);

    useEffect(() => {
        if (mode === 'add') {
            setTempTeam(intialTeamInfo);
        }
    }, [mode]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data: TeamSchema = {
            id: tempTeam.id,
            teamName: formData.get('teamName').toString(),
            info: {
                owner: formData.get('owner').toString(),
                phone: formData.get('phone').toString(),
                address: formData.get('address').toString(),
            },
            members: tempTeam.members,
        }
        handleConfirm(data);
    }

    const handleCancel = () => {
        if (mode === 'add') {
            // clear form
            setTempTeam(intialTeamInfo);
        } else if (mode === 'edit') {
            changeMode('view');
            setTempTeam(teamInfo);
        }
    }

    const onUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const { teamName, info: { address, owner, phone } } = tempTeam;

        setTempTeam({
            ...tempTeam,
            teamName: name === 'teamName' ? value : teamName,
            info: {
                owner: name === 'owner' ? value : owner,
                phone: name === 'phone' ? value : phone,
                address: name === 'address' ? value : address,
            }
        })
    }

    return (
        <TeamInfoLayout>
            {
                mode === 'edit' || mode === 'add' ? <>
                    <div className='team-info-label'>Th??ng tin ?????i</div>
                    <InfoForm ref={formRef} >
                        <div className="field field--name">
                            <Input
                                value={tempTeam.teamName}
                                onChange={onUpdate}
                                label='T??n ?????i:'
                                name='teamName'
                            />
                        </div>
                        <div className="field field--other">
                            <Input
                                value={tempTeam.info.owner}
                                onChange={onUpdate}
                                label='Ch??? s??n:'
                                name='owner'
                            />
                            <Input
                                value={tempTeam.info.phone}
                                onChange={onUpdate}
                                label='S??? ??i???n tho???i:'
                                name='phone'
                            />
                        </div>
                        <div className="field field--address">
                            <TextArea
                                value={tempTeam.info.address}
                                onChange={onUpdate}
                                label='?????a ch???:'
                                name='address'
                            />
                        </div>
                    </InfoForm>
                    <SubmitSection>
                        <Button
                            onClick={handleSave}
                            type='submit'
                        >
                            {mode === 'edit' ? 'L??u' : 'T???o ?????i'}
                        </Button>
                        <Button
                            buttonType='secondary'
                            type='button'
                            onClick={handleCancel}
                        >
                            {mode === 'edit' ? 'H???y' : 'X??a tr???ng'}
                        </Button>
                    </SubmitSection>
                </>
                    :
                    <InfoSection>
                        {
                            tempTeam ? (
                                <>
                                    <h2>{tempTeam.teamName} <Icon onClick={() => changeMode("edit")} src={editIcon} /></h2>
                                    <div className="info-field">
                                        <span className="info-field-label">Ch??? s??n:</span>
                                        <span className="info-field-data">{tempTeam.info.owner}</span>
                                    </div>
                                    <div className="info-field">
                                        <span className="info-field-label">S??? ??i???n tho???i:</span>
                                        <span className="info-field-data">{tempTeam.info.phone}</span>
                                    </div>
                                    <div className="info-field__address">
                                        <span className="info-field-label">?????a ch???:</span>
                                        <span className="info-field-data">{tempTeam.info.address}</span>
                                    </div>

                                </>
                            ) : <div> Loading</div>
                        }
                    </InfoSection>
            }
        </TeamInfoLayout >
    )
}

export default TeamInfo