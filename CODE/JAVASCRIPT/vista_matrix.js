// -- FUNCTIONS

function GetMatrix4(
    xx = 1.0,
    xy = 0.0,
    xz = 0.0,
    xw = 0.0,
    yx = 0.0,
    yy = 1.0,
    yz = 0.0,
    yw = 0.0,
    zx = 0.0,
    zy = 0.0,
    zz = 1.0,
    zw = 0.0,
    wx = 0.0,
    wy = 0.0,
    wz = 0.0,
    ww = 1.0
    )
{
    return Float32Array.of(
        xx, xy, xz, xw,
        yx, yy, yz, xw,
        zx, zy, zz, xw,
        wx, wy, wz, xw
        );
}

// ~~

function GetIdentityMatrix4(
    )
{
    return Float32Array.of(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
        );
}

// ~~

function IsIdentityMatrix4(
    matrix
    )
{
    return (
        matrix[ 0 ] == 1.0
        && matrix[ 1 ] == 0.0
        && matrix[ 2 ] == 0.0
        && matrix[ 3 ] == 0.0
        && matrix[ 4 ] == 0.0
        && matrix[ 5 ] == 1.0
        && matrix[ 6 ] == 0.0
        && matrix[ 7 ] == 0.0
        && matrix[ 8 ] == 0.0
        && matrix[ 9 ] == 0.0
        && matrix[ 10 ] == 1.0
        && matrix[ 11 ] == 0.0
        && matrix[ 12 ] == 0.0
        && matrix[ 13 ] == 0.0
        && matrix[ 14 ] == 0.0
        && matrix[ 15 ] == 1.0
        );
}

// ~~

function IsRoughlyIdentityMatrix4(
    matrix,
    precision = DefaultPrecision
    )
{
    var
        xx = matrix[ 0 ],
        xy = matrix[ 1 ],
        xz = matrix[ 2 ],
        xw = matrix[ 3 ],
        yx = matrix[ 4 ],
        yy = matrix[ 5 ],
        yz = matrix[ 6 ],
        yw = matrix[ 7 ],
        zx = matrix[ 8 ],
        zy = matrix[ 9 ],
        zz = matrix[ 10 ],
        zw = matrix[ 11 ],
        wx = matrix[ 12 ],
        wy = matrix[ 13 ],
        wz = matrix[ 14 ],
        ww = matrix[ 15 ];

    return (
        xx >= 1.0 - precision
        && xx <= 1.0 + precision
        && xy >= -precision
        && xy <= precision
        && xz >= -precision
        && xz <= precision
        && xw >= -precision
        && xw <= precision
        && yx >= -precision
        && yx <= precision
        && yy >= 1.0 - precision
        && yy <= 1.0 + precision
        && yz >= -precision
        && yz <= precision
        && yw >= -precision
        && yw <= precision
        && zx >= -precision
        && zx <= precision
        && zy >= -precision
        && zy <= precision
        && zz >= 1.0 - precision
        && zz <= 1.0 + precision
        && zw >= -precision
        && zw <= precision
        && wx >= -precision
        && wx <= precision
        && wy >= -precision
        && wy <= precision
        && wz >= -precision
        && wz <= precision
        && ww >= 1.0 - precision
        && ww <= 1.0 + precision
        );
}

// ~~

function IsRoughlySameMatrix4(
    first_matrix,
    second_matrix,
    precision = DefaultPrecision
    )
{
    var
        xx = first_matrix[ 0 ] - second_matrix[ 0 ],
        xy = first_matrix[ 1 ] - second_matrix[ 1 ],
        xz = first_matrix[ 2 ] - second_matrix[ 2 ],
        xw = first_matrix[ 3 ] - second_matrix[ 3 ],
        yx = first_matrix[ 4 ] - second_matrix[ 4 ],
        yy = first_matrix[ 5 ] - second_matrix[ 5 ],
        yz = first_matrix[ 6 ] - second_matrix[ 6 ],
        yw = first_matrix[ 7 ] - second_matrix[ 7 ],
        zx = first_matrix[ 8 ] - second_matrix[ 8 ],
        zy = first_matrix[ 9 ] - second_matrix[ 9 ],
        zz = first_matrix[ 10 ] - second_matrix[ 10 ],
        zw = first_matrix[ 11 ] - second_matrix[ 11 ],
        wx = first_matrix[ 12 ] - second_matrix[ 12 ],
        wy = first_matrix[ 13 ] - second_matrix[ 13 ],
        wz = first_matrix[ 14 ] - second_matrix[ 14 ],
        ww = first_matrix[ 15 ] - second_matrix[ 15 ];

    return (
        xx >= -precision
        && xx <= precision
        && xy >= -precision
        && xy <= precision
        && xz >= -precision
        && xz <= precision
        && xw >= -precision
        && xw <= precision
        && yx >= -precision
        && yx <= precision
        && yy >= -precision
        && yy <= precision
        && yz >= -precision
        && yz <= precision
        && yw >= -precision
        && yw <= precision
        && zx >= -precision
        && zx <= precision
        && zy >= -precision
        && zy <= precision
        && zz >= -precision
        && zz <= precision
        && zw >= -precision
        && zw <= precision
        && wx >= -precision
        && wx <= precision
        && wy >= -precision
        && wy <= precision
        && wz >= -precision
        && wz <= precision
        && ww >= -precision
        && ww <= precision
        );
}

// ~~

function GetScalingMatrix4(
    scaling_vector
    )
{
    return Float32Array.of(
        scaling_vector[ 0 ], 0.0, 0.0, 0.0,
        0.0, scaling_vector[ 1 ], 0.0, 0.0,
        0.0, 0.0, scaling_vector [ 2 ], 0.0,
        0.0, 0.0, 0.0, 1.0
        );
}

// ~~

function GetXRotationMatrix4(
    x_angle
    )
{
    var
        x_cosinus = GetCosinus( x_angle ),
        x_sinus = GetSinus( x_angle );

    return Float32Array.of(
        1.0, 0.0, 0.0, 0.0,
        0.0, x_cosinus, x_sinus, 0.0,
        0.0, -x_sinus, x_cosinus, 0.0,
        0.0, 0.0, 0.0, 1.0
        );
}

// ~~

function GetYRotationMatrix4(
    y_angle
    )
{
    var
        y_cosinus = GetCosinus( y_angle ),
        y_sinus = GetSinus( y_angle );

    return Float32Array.of(
        y_cosinus, 0.0, -y_sinus, 0.0,
        0.0, 1.0, 0.0, 0.0,
        y_sinus, 0.0, y_cosinus, 0.0,
        0.0, 0.0, 0.0, 1.0
        );
}

// ~~

function GetZRotationMatrix4(
    z_angle
    )
{
    var
        z_cosinus = GetCosinus( z_angle ),
        z_sinus = GetSinus( z_angle );

    return Float32Array.of(
        z_cosinus, z_sinus, 0.0, 0.0,
        -z_sinus, z_cosinus, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
        );
}

// ~~

function GetTranslationMatrix4(
    translation_vector
    )
{
    return Float32Array.of(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        translation_vector[ 0 ], translation_vector[ 1 ], translation_vector[ 2 ], 1.0
        );
}

// ~~

function GetMatrix4XVector3(
    matrix
    )
{
    return Float32Array.of(
        matrix[ 0 ],
        matrix[ 1 ],
        matrix[ 2 ]
        );
}

// ~~

function GetMatrix4YVector3(
    matrix
    )
{
    return Float32Array.of(
        matrix[ 4 ],
        matrix[ 5 ],
        matrix[ 6 ]
        );
}

// ~~

function GetMatrix4ZVector3(
    matrix
    )
{
    return Float32Array.of(
        matrix[ 8 ],
        matrix[ 9 ],
        matrix[ 10 ]
        );
}

// ~~

function GetMatrix4WVector3(
    matrix
    )
{
    return Float32Array.of(
        matrix[ 12 ],
        matrix[ 13 ],
        matrix[ 14 ]
        );
}

// ~~

function GetMatrix4ScalingVector3(
    matrix
    )
{
    return Float32Array.of(
        GetVector3Length( [ matrix[ 0 ], matrix[ 0 ], matrix[ 0 ] ] ),
        GetVector3Length( [ matrix[ 4 ], matrix[ 5 ], matrix[ 6 ] ] ),
        GetVector3Length( [ matrix[ 8 ], matrix[ 9 ], matrix[ 10 ] ] )
        );
}

// ~~

function GetMatrix4TransformedVector3(
    matrix,
    vector
    )
{
    var
        xx = matrix[ 0 ],
        xy = matrix[ 1 ],
        xz = matrix[ 2 ],
        xw = matrix[ 3 ],
        yx = matrix[ 4 ],
        yy = matrix[ 5 ],
        yz = matrix[ 6 ],
        yw = matrix[ 7 ],
        zx = matrix[ 8 ],
        zy = matrix[ 9 ],
        zz = matrix[ 10 ],
        zw = matrix[ 11 ],
        wx = matrix[ 12 ],
        wy = matrix[ 13 ],
        wz = matrix[ 14 ],
        ww = matrix[ 15 ],
        x = vector[ 0 ],
        y = vector[ 1 ],
        z = vector[ 2 ],
        one_over_w = 1.0 / ( x * xw + y * yw + z * zw + ww );

    return Float32Array.of(
        ( x * xx + y * yx + z * zx + wx ) * one_over_w,
        ( x * xy + y * yy + z * zy + wy ) * one_over_w,
        ( x * xz + y * yz + z * zz + wz ) * one_over_w
        );
}

// ~~

function GetMatrix4TransformedVector4(
    matrix,
    vector
    )
{
    var
        xx = matrix[ 0 ],
        xy = matrix[ 1 ],
        xz = matrix[ 2 ],
        xw = matrix[ 3 ],
        yx = matrix[ 4 ],
        yy = matrix[ 5 ],
        yz = matrix[ 6 ],
        yw = matrix[ 7 ],
        zx = matrix[ 8 ],
        zy = matrix[ 9 ],
        zz = matrix[ 10 ],
        zw = matrix[ 11 ],
        wx = matrix[ 12 ],
        wy = matrix[ 13 ],
        wz = matrix[ 14 ],
        ww = matrix[ 15 ],
        x = vector[ 0 ],
        y = vector[ 1 ],
        z = vector[ 2 ],
        w = vector[ 3 ];

    return Float32Array.of(
        x * xx + y * yx + z * zx + w * wx,
        x * xy + y * yy + z * zy + w * wy,
        x * xz + y * yz + z * zz + w * wz,
        x * xw + y * yw + z * zw + w * ww
        );
}

// ~~

function GetProductMatrix4(
    first_matrix,
    second_matrix
    )
{
    var
        first_xx = first_matrix[ 0 ],
        first_xy = first_matrix[ 1 ],
        first_xz = first_matrix[ 2 ],
        first_xw = first_matrix[ 3 ],
        first_yx = first_matrix[ 4 ],
        first_yy = first_matrix[ 5 ],
        first_yz = first_matrix[ 6 ],
        first_yw = first_matrix[ 7 ],
        first_zx = first_matrix[ 8 ],
        first_zy = first_matrix[ 9 ],
        first_zz = first_matrix[ 10 ],
        first_zw = first_matrix[ 11 ],
        first_wx = first_matrix[ 12 ],
        first_wy = first_matrix[ 13 ],
        first_wz = first_matrix[ 14 ],
        first_ww = first_matrix[ 15 ],
        second_xx = second_matrix[ 0 ],
        second_xy = second_matrix[ 1 ],
        second_xz = second_matrix[ 2 ],
        second_xw = second_matrix[ 3 ],
        second_yx = second_matrix[ 4 ],
        second_yy = second_matrix[ 5 ],
        second_yz = second_matrix[ 6 ],
        second_yw = second_matrix[ 7 ],
        second_zx = second_matrix[ 8 ],
        second_zy = second_matrix[ 9 ],
        second_zz = second_matrix[ 10 ],
        second_zw = second_matrix[ 11 ],
        second_wx = second_matrix[ 12 ],
        second_wy = second_matrix[ 13 ],
        second_wz = second_matrix[ 14 ],
        second_ww = second_matrix[ 15 ];

    return Float32Array.of(
        first_xx * second_xx + first_xy * second_yx + first_xz * second_zx + first_xw * second_wx,
        first_xx * second_xy + first_xy * second_yy + first_xz * second_zy + first_xw * second_wy,
        first_xx * second_xz + first_xy * second_yz + first_xz * second_zz + first_xw * second_wz,
        first_xx * second_xw + first_xy * second_yw + first_xz * second_zw + first_xw * second_ww,
        first_yx * second_xx + first_yy * second_yx + first_yz * second_zx + first_yw * second_wx,
        first_yx * second_xy + first_yy * second_yy + first_yz * second_zy + first_yw * second_wy,
        first_yx * second_xz + first_yy * second_yz + first_yz * second_zz + first_yw * second_wz,
        first_yx * second_xw + first_yy * second_yw + first_yz * second_zw + first_yw * second_ww,
        first_zx * second_xx + first_zy * second_yx + first_zz * second_zx + first_zw * second_wx,
        first_zx * second_xy + first_zy * second_yy + first_zz * second_zy + first_zw * second_wy,
        first_zx * second_xz + first_zy * second_yz + first_zz * second_zz + first_zw * second_wz,
        first_zx * second_xw + first_zy * second_yw + first_zz * second_zw + first_zw * second_ww,
        first_wx * second_xx + first_wy * second_yx + first_wz * second_zx + first_ww * second_wx,
        first_wx * second_xy + first_wy * second_yy + first_wz * second_zy + first_ww * second_wy,
        first_wx * second_xz + first_wy * second_yz + first_wz * second_zz + first_ww * second_wz,
        first_wx * second_xw + first_wy * second_yw + first_wz * second_zw + first_ww * second_ww
        );
}

// ~~

function GetZxyRotationMatrix4(
    zxy_rotation_vector
    )
{
    var
        x_angle = zxy_rotation_vector[ 0 ],
        y_angle = zxy_rotation_vector[ 1 ],
        z_angle = zxy_rotation_vector[ 2 ],
        x_cosinus = GetCosinus( x_angle ),
        x_sinus = GetSinus( x_angle ),
        y_cosinus = GetCosinus( y_angle ),
        y_sinus = GetSinus( y_angle ),
        z_cosinus = GetCosinus( z_angle ),
        z_sinus = GetSinus( z_angle );

    return Float32Array.of(
        z_cosinus * y_cosinus + z_sinus * x_sinus * y_sinus,
        z_sinus * x_cosinus,
        -z_cosinus * y_sinus + z_sinus * x_sinus * y_cosinus,
        0.0,
        -z_sinus * y_cosinus + z_cosinus * x_sinus * y_sinus,
        z_cosinus * x_cosinus,
        z_sinus * y_sinus + z_cosinus * x_sinus * y_cosinus,
        0.0,
        x_cosinus * y_sinus,
        -x_sinus,
        x_cosinus * y_cosinus,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0
        );
}

// ~~

function GetZxyTransformMatrix4(
    scaling_vector,
    rotation_vector,
    translation_vector
    )
{
    var
        x_scaling = scaling_vector[ 0 ],
        y_scaling = scaling_vector[ 1 ],
        z_scaling = scaling_vector[ 2 ],
        x_angle = rotation_vector[ 0 ],
        y_angle = rotation_vector[ 1 ],
        z_angle = rotation_vector[ 2 ],
        x_cosinus = GetCosinus( x_angle ),
        x_sinus = GetSinus( x_angle ),
        y_cosinus = GetCosinus( y_angle ),
        y_sinus = GetSinus( y_angle ),
        z_cosinus = GetCosinus( z_angle ),
        z_sinus = GetSinus( z_angle ),
        x_translation = translation_vector[ 0 ],
        y_translation = translation_vector[ 1 ],
        z_translation = translation_vector[ 2 ];

    return Float32Array.of(
        x_scaling * ( z_cosinus * y_cosinus + z_sinus * x_sinus * y_sinus ),
        x_scaling * ( z_sinus * x_cosinus ),
        x_scaling * ( -z_cosinus * y_sinus + z_sinus * x_sinus * y_cosinus ),
        0.0,
        y_scaling * ( -z_sinus * y_cosinus + z_cosinus * x_sinus * y_sinus ),
        y_scaling * ( z_cosinus * x_cosinus ),
        y_scaling * ( z_sinus * y_sinus + z_cosinus * x_sinus * y_cosinus ),
        0.0,
        z_scaling * ( x_cosinus * y_sinus ),
        z_scaling * ( -x_sinus ),
        z_scaling * ( x_cosinus * y_cosinus ),
        0.0,
        x_translation,
        y_translation,
        z_translation,
        1.0
        );
}

// ~~

function GetTransformMatrix4(
    scaling_vector,
    rotation_quaternion,
    translation_vector
    )
{
    var
        x_scaling = scaling_vector[ 0 ],
        y_scaling = scaling_vector[ 1 ],
        z_scaling = scaling_vector[ 2 ],
        quaternion_x = rotation_quaternion[ 0 ],
        quaternion_y = rotation_quaternion[ 1 ],
        quaternion_z = rotation_quaternion[ 2 ],
        quaternion_w = rotation_quaternion[ 3 ],
        quaternion_x2 = quaternion_x + quaternion_x,
        quaternion_y2 = quaternion_y + quaternion_y,
        quaternion_z2 = quaternion_z + quaternion_z,
        quaternion_xx2 = quaternion_x * quaternion_x2,
        quaternion_xy2 = quaternion_x * quaternion_y2,
        quaternion_xz2 = quaternion_x * quaternion_z2,
        quaternion_yy2 = quaternion_y * quaternion_y2,
        quaternion_yz2 = quaternion_y * quaternion_z2,
        quaternion_zz2 = quaternion_z * quaternion_z2,
        quaternion_wx2 = quaternion_w * quaternion_x2,
        quaternion_wy2 = quaternion_w * quaternion_y2,
        quaternion_wz2 = quaternion_w * quaternion_z2,
        x_translation = translation_vector[ 0 ],
        y_translation = translation_vector[ 1 ],
        z_translation = translation_vector[ 2 ];

    return Float32Array.of(
        x_scaling * ( 1.0 - quaternion_yy2 - quaternion_zz2 ),
        x_scaling * ( quaternion_xy2 + quaternion_wz2 ),
        x_scaling * ( quaternion_xz2 - quaternion_wy2 ),
        0.0,
        y_scaling * ( quaternion_xy2 - quaternion_wz2 ),
        y_scaling * ( 1.0 - quaternion_xx2 - quaternion_zz2 ),
        y_scaling * ( quaternion_yz2 + quaternion_wx2 ),
        0.0,
        z_scaling * ( quaternion_xz2 + quaternion_wy2 ),
        z_scaling * ( quaternion_yz2 - quaternion_wx2 ),
        z_scaling * ( 1.0 - quaternion_xx2 - quaternion_yy2 ),
        0.0,
        x_translation,
        y_translation,
        z_translation,
        1.0
        );
}

// ~~

function GetLookMatrix4(
    position_vector,
    z_axis_vector,
    y_axis_vector
    )
{
    var
        x_axis_vector = GetNormalizedVector3( GetCrossProductVector3( y_axis_vector, z_axis_vector ) );

    y_axis_vector = GetNormalizedVector3( GetCrossProductVector3( z_axis_vector, x_axis_vector ) );

    return Float32Array.of(
        x_axis_vector[ 0 ],
        x_axis_vector[ 1 ],
        x_axis_vector[ 2 ],
        0.0,
        y_axis_vector[ 0 ],
        y_axis_vector[ 1 ],
        y_axis_vector[ 2 ],
        0.0,
        z_axis_vector[ 0 ],
        z_axis_vector[ 1 ],
        z_axis_vector[ 2 ],
        0.0,
        position_vector[ 0 ],
        position_vector[ 1 ],
        position_vector[ 2 ],
        1.0
        );
}

// ~~

function GetFrustumMatrix4(
    left_x,
    right_x,
    bottom_y,
    top_y,
    near_z,
    far_z
    )
{
    var
        one_over_x_offset = 1.0 / ( right_x - left_x ),
        one_over_y_offset = 1.0 / ( top_y - bottom_y ),
        one_over_z_offset = 1.0 / ( near_z - far_z );

    return Float32Array.of(
        2.0 * near_z * one_over_x_offset,
        0.0,
        0.0,
        0.0,
        0.0,
        2.0 * near_z * one_over_y_offset,
        0.0,
        0.0,
        ( left_x + right_x ) * one_over_x_offset,
        ( bottom_y + top_y ) * one_over_y_offset,
        ( near_z + far_z ) * one_over_z_offset,
        -1.0,
        0.0,
        0.0,
        near_z * far_z * one_over_z_offset,
        0.0
        );
}

// ~~

function GetOrthographicMatrix4(
    left_x,
    right_x,
    bottom_y,
    top_y,
    near_z,
    far_z
    )
{
    var
        one_over_x_offset = 1.0 / ( left_x - right_x ),
        one_over_y_offset = 1.0 / ( bottom_y - top_y ),
        one_over_z_offset = 1.0 / ( near_z - far_z );

    return Float32Array.of(
        -2.0 * one_over_x_offset,
        0.0,
        0.0,
        0.0,
        0.0,
        -2.0 * one_over_y_offset,
        0.0,
        0.0,
        0.0,
        0.0,
        2.0 * one_over_z_offset,
        0.0,
        ( left_x + right_x ) * one_over_x_offset,
        ( bottom_y + top_y ) * one_over_y_offset,
        ( near_z + far_z ) * one_over_z_offset,
        1.0
        );
}

// ~~

function GetPerspectiveMatrix4(
    y_angle,
    aspect_ratio,
    near_z,
    far_z
    )
{
    var
        y_scaling = 1.0 / GetTangent( y_angle * 0.5 ),
        one_over_z_offset = 1.0 / ( near_z - far_z );

    return Float32Array.of(
        y_scaling / aspect_ratio,
        0.0,
        0.0,
        0.0,
        0.0,
        y_scaling,
        0.0,
        0.0,
        0.0,
        0.0,
        ( near_z + far_z ) * one_over_z_offset,
        -1.0,
        0.0,
        0.0,
        2.0 * far_z * near_z * one_over_z_offset,
        0.0
        );
}

// ~~

function GetFieldOfViewPerspectiveMatrix4(
    left_angle,
    right_angle,
    down_angle,
    up_angle,
    near_z,
    far_z
    )
{
    var
        up_tangent = Math.tan( up_angle ),
        down_tangent = Math.tan( down_angle ),
        left_tangent = Math.tan( left_angle ),
        right_tangent = Math.tan( right_angle ),
        x_scaling = 2.0 / ( left_tangent + right_tangent ),
        y_scaling = 2.0 / ( up_tangent + down_tangent ),
        one_over_z_offset = 1.0 / ( near_z - far_z );

    return Float32Array.of(
        x_scaling,
        0.0,
        0.0,
        0.0,
        0.0,
        y_scaling,
        0.0,
        0.0,
        -0.5 * x_scaling * ( left_tangent - right_tangent ),
        0.5 * y_scaling * ( up_tangent - down_tangent ),
        far_z * one_over_z_offset,
        -1.0,
        0.0,
        0.0,
        far_z * near_z * one_over_z_offset,
        0.0
        );
}

// ~~

function GetTransposeMatrix4(
    matrix
    )
{
    return Float32Array.of(
        matrix[ 0 ],
        matrix[ 4 ],
        matrix[ 8 ],
        matrix[ 12 ],
        matrix[ 1 ],
        matrix[ 5 ],
        matrix[ 9 ],
        matrix[ 13 ],
        matrix[ 2 ],
        matrix[ 6 ],
        matrix[ 10 ],
        matrix[ 14 ],
        matrix[ 3 ],
        matrix[ 7 ],
        matrix[ 11 ],
        matrix[ 15 ]
        );
}

// ~~

function GetInverseMatrix4(
    matrix
    )
{
    var
        a00 = matrix[ 0 ],
        a01 = matrix[ 1 ],
        a02 = matrix[ 2 ],
        a03 = matrix[ 3 ],
        a10 = matrix[ 4 ],
        a11 = matrix[ 5 ],
        a12 = matrix[ 6 ],
        a13 = matrix[ 7 ],
        a20 = matrix[ 8 ],
        a21 = matrix[ 9 ],
        a22 = matrix[ 10 ],
        a23 = matrix[ 11 ],
        a30 = matrix[ 12 ],
        a31 = matrix[ 13 ],
        a32 = matrix[ 14 ],
        a33 = matrix[ 15 ],
        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,
        one_over_determinant = 1.0 / ( b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06 );

    return Float32Array.of(
         ( a11 * b11 - a12 * b10 + a13 * b09 ) * one_over_determinant,
         ( a02 * b10 - a01 * b11 - a03 * b09 ) * one_over_determinant,
         ( a31 * b05 - a32 * b04 + a33 * b03 ) * one_over_determinant,
         ( a22 * b04 - a21 * b05 - a23 * b03 ) * one_over_determinant,
         ( a12 * b08 - a10 * b11 - a13 * b07 ) * one_over_determinant,
         ( a00 * b11 - a02 * b08 + a03 * b07 ) * one_over_determinant,
         ( a32 * b02 - a30 * b05 - a33 * b01 ) * one_over_determinant,
         ( a20 * b05 - a22 * b02 + a23 * b01 ) * one_over_determinant,
         ( a10 * b10 - a11 * b08 + a13 * b06 ) * one_over_determinant,
         ( a01 * b08 - a00 * b10 - a03 * b06 ) * one_over_determinant,
         ( a30 * b04 - a31 * b02 + a33 * b00 ) * one_over_determinant,
         ( a21 * b02 - a20 * b04 - a23 * b00 ) * one_over_determinant,
         ( a11 * b07 - a10 * b09 - a12 * b06 ) * one_over_determinant,
         ( a00 * b09 - a01 * b07 + a02 * b06 ) * one_over_determinant,
         ( a31 * b01 - a30 * b03 - a32 * b00 ) * one_over_determinant,
         ( a20 * b03 - a21 * b01 + a22 * b00 ) * one_over_determinant
         );
}
