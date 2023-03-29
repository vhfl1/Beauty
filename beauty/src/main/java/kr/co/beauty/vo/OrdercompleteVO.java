package kr.co.beauty.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdercompleteVO {

	private int ordNo;
	private String uid;
	private String password;
	private int ordCount;
	private int ordPrice;
	private int ordDisprice;
	private int ordDelivery;
	private int savePoint;
	private int usedPoint;
	private int total;
	private String orderer;
	private String orderHp;
	private String orderZip;
	private String orderAddr1;
	private String orderAddr2;
	private String orderEmail;
	private String recipName;
	private String recipHp;
	private String recipZip;
	private String recipAddr1;
	private String recipAddr2;
	private String message;
	private String payment;
	private String ordComplete;
	private String ordDate;
	
}
