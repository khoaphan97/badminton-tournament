import Button from '@components/Button'
import Icon from '@components/Icon'
import React, { FC, useEffect, useState } from 'react'
import { TeamMemberLayout } from './styled'
import TeamList from './TeamList'

import plusCircle from '../../../assets/icons/add-circle.svg';
import RegisterMember from './RegisterMember'
import { AthleteSchema } from '@data/Athlete'
import { useToastAction } from '@components/Toast'

type Props = {
    members: string[];
    addMember: (data: AthleteSchema) => void;
    removeMember: (id: string) => void;
    arrangeMember: (id: number, direction: 'up' | 'down') => void;
}

const { fetchBatch } = window.Api;

const initialAtheleteInfo: AthleteSchema = {
    id: '',
    name: '',
    sex: 'MALE',
    teamId: ''
}

const TeamMembers: FC<Props> = ({ members, addMember, removeMember, arrangeMember }) => {

    const [registerView, setRegisterView] = useState(members.length === 0);
    const [currentMember, setCurrentMember] = useState<AthleteSchema>(initialAtheleteInfo);
    const [teamMembers, setTeamMembers] = useState<AthleteSchema[]>([]);
    const { setToastVisible, setToastContent } = useToastAction();

    useEffect(() => {
        getMemberInfo();
        setRegisterView(members.length === 0);
        setCurrentMember(initialAtheleteInfo);
    }, [members]);

    const getMemberInfo = () => {
        if (members.length > 0) {
            fetchBatch<AthleteSchema>('ATHLETES', members).then(response => {
                const reRank = members.map(memberId => {
                    let match: AthleteSchema;
                    response.map(member => {
                        if (member.id === memberId) {
                            match = member;
                        }
                    });
                    return match;
                })
                setTeamMembers(reRank);
            });
        } else {
            setTeamMembers([]);
        }
    }

    const onShowInfo = (info: AthleteSchema) => {
        setCurrentMember({ ...info });
        setRegisterView(true);
    }

    const handleUpdateInfo = (info: { name: string; sex: 'MALE' | 'FEMALE' }) => {
        setCurrentMember({
            ...currentMember,
            ...info,
        });
    }

    const handleCancel = () => {
        if (members.length > 0) {
            setRegisterView(false);
            setCurrentMember(initialAtheleteInfo);
        } else {
            setCurrentMember({
                ...currentMember,
                name: '',
                sex: 'MALE',
            })
        }
    }

    const handleSave = () => {
        if (!currentMember.name) {
            setToastVisible(true);
            setToastContent(['T??n th??nh vi??n kh??ng ???????c ????? tr???ng'], 'error');
            return;
        }

        const index = teamMembers.findIndex(member => member.name === currentMember.name);
        if (index > -1) {
            setToastVisible(true);
            setToastContent(['Th??nh vi??n ???? t???n t???i'], 'error');
            return;
        }

        addMember(currentMember);
        setRegisterView(false);
    }

    return (
        <TeamMemberLayout>
            <div className="team-list-label">
                Th??nh vi??n
            </div>
            {
                !registerView ? (
                    <Button
                        onClick={() => {
                            setRegisterView(true);
                            setCurrentMember(initialAtheleteInfo);
                        }}
                        buttonType='secondary'
                        className='add-member'
                    >
                        Th??m th??nh vi??n <Icon src={plusCircle} />
                    </Button>
                ) : <RegisterMember
                    onCancel={handleCancel}
                    info={currentMember}
                    onUpdateInfo={handleUpdateInfo}
                    onSave={handleSave}
                />
            }
            {
                teamMembers.length > 0 && <TeamList
                    onRemoveMember={removeMember}
                    onShowInfo={onShowInfo}
                    onArange={arrangeMember}
                    data={teamMembers}
                />
            }
        </TeamMemberLayout>
    )
}

export default TeamMembers