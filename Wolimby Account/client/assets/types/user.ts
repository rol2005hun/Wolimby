interface UserProfile {
    _id: string,
    profile: {
        username: string,
        email: string,
        name: string,
        password: string,
        profilePicture: string,
        biography: string,
        birthday?: Date,
        roles: number[],

        notificationList: [{
            _id: string,
            title: string,
            profilePicture: string,
            message: string,
            createdAt: Date
        }],

        ipList: [{
            _id: string,
            ip: string,
            loggedAt: Date
        }],

        createdAt: Date
    },
    privacy: {
        showName: boolean,
        showEmail: boolean
    },
    appearance: {
        backgroundImage: string,
        theme: string
    }
}

export default UserProfile;